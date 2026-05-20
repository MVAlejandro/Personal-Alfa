import supabase from '../supabase/supabase-client.js'
// Utilidades
import { findExtraTimeDay } from './extra-time-service.js';
import { getWeekDay } from '../utils/time-functions.js';

// Función auxiliar para determinar si un empleado tiene retardo
function isLate(variacion) {
    if (!variacion) return false;

    const match = variacion.match(/([+-])(\d{2}):(\d{2})/);
    if (!match) return false;

    const sign = match[1];
    const hours = parseInt(match[2], 10);
    const minutes = parseInt(match[3], 10);
    const totalMinutes = hours * 60 + minutes;

    return sign === '+' && totalMinutes > 2;
}

// Función para obtener toda la lista de asistencia y ausencias en base a empleados activos y registros
export async function getCalendarEvents(staffList, allAttendances, allAbsences) {
    const grouped = {};
    const permissionMap = {};

    staffList.forEach(emp => {
        (emp.permisos || []).forEach(fecha => {
            const key = `${emp.id_empleado}-${fecha}`;
            permissionMap[key] = true;
        });
    });

    // Agrupar asistencias por empleado + fecha
    await Promise.all(allAttendances.map(async (a) => {
        const key = `${a.id_empleado}-${a.fecha_asistencia}`;
        const tiempo_extra = await findExtraTimeDay(a.id_empleado, a.fecha_asistencia);

        if (!grouped[key]) {
            grouped[key] = {
                id_empleado: a.id_empleado,
                numero_empleado: a.numero_empleado,
                nombre: a.nombre,
                puesto: a.puesto,
                fecha: a.fecha_asistencia,
                dia: a.dia,
                entradas: [],
                salidas: [],
                variacionesEntrada: [],
                variacionesSalida: [],
                verificacion: a.verificación,
                tiempo_extra
            };
        }

        if (a.tipo === 'Entrada') {
            grouped[key].entradas.push(a.hora_asistencia);
            grouped[key].variacionesEntrada.push(a.variacion);
        }

        if (a.tipo === 'Salida') {
            grouped[key].salidas.push(a.hora_asistencia);
            grouped[key].variacionesSalida.push(a.variacion);
        }
    }));

    // Formatear asistencias existentes
    const formattedAttendances = Object.values(grouped).map(g => {
        const entradasOrdenadas = g.entradas
            .map((hora, i) => ({ hora, variacion: g.variacionesEntrada[i] }))
            .sort((a, b) => a.hora.localeCompare(b.hora));

        const salidasOrdenadas = g.salidas
            .map((hora, i) => ({ hora, variacion: g.variacionesSalida[i] }))
            .sort((a, b) => a.hora.localeCompare(b.hora));

        const primeraEntrada = entradasOrdenadas[0] || {};
        const ultimaSalida = salidasOrdenadas[salidasOrdenadas.length - 1] || {};

        return {
            id_empleado: g.id_empleado,
            numero_empleado: g.numero_empleado,
            nombre: g.nombre,
            puesto: g.puesto,
            fecha: g.fecha,
            dia: g.dia,
            entrada: primeraEntrada.hora || "",
            salida: ultimaSalida.hora || "",
            variacion_entrada: primeraEntrada.variacion || "",
            variacion_salida: ultimaSalida.variacion || "",
            verificacion: g.verificacion,
            tiempo_extra: g.tiempo_extra || ""
        };
    });

    // Mapa de Asistencias
    const attendanceMap = {};
    formattedAttendances.forEach(a => {
        const key = `${a.id_empleado}-${a.fecha}`;
        attendanceMap[key] = a;
    });

    // Mapa de Ausencias
    const absenceMap = {};
    allAbsences.forEach(a => {
        const key = `${a.id_empleado}-${a.fecha}`;
        absenceMap[key] = a;
    });

    // Obtener fechas únicas
    const uniqueDates = [...new Set([
        ...formattedAttendances.map(a => a.fecha),
        ...allAbsences.map(a => a.fecha)
    ])];

    // Construir lista completa incluyendo los faltantes
    const fullList = [];

    uniqueDates.forEach(fecha => {
        staffList.forEach(emp => {
            const key = `${emp.id_empleado}-${fecha}`;
            const permissionKey = `${emp.id_empleado}-${fecha}`;
            const tienePermisoPendiente = !!permissionMap[permissionKey];
            
            // Obtener nombre del día
            const weekDay = getWeekDay(fecha);
            
            // Verificar si es día de descanso
            const esDescanso = emp.dias_descanso?.includes(weekDay) || false;
            
            // Si es descanso, registrarlo y evitar procesar asistencia/ausencia
            if (esDescanso) {
                const registro = {
                    id_empleado: emp.id_empleado,
                    numero_empleado: emp.numero_empleado,
                    nombre: emp.nombre,
                    puesto: emp.puesto,
                    fecha,
                    dia: weekDay,
                    entrada: "",
                    salida: "",
                    variacion_entrada: "",
                    variacion_salida: "",
                    verificacion: "",
                    tiempo_extra: "",
                    tipo_dia: "Descanso",
                    detalle: "Descanso",
                    permiso_pendiente: tienePermisoPendiente
                };
                fullList.push(registro);
                return;
            }
            
            // Si no es descanso, continuar con el procesamiento
            const asistencia = attendanceMap[key];
            const ausencia = absenceMap[key];

            let registro = {
                id_empleado: emp.id_empleado,
                numero_empleado: emp.numero_empleado,
                nombre: emp.nombre,
                puesto: emp.puesto,
                fecha,
                dia: asistencia?.dia || "",
                entrada: asistencia?.entrada || "",
                salida: asistencia?.salida || "",
                variacion_entrada: asistencia?.variacion_entrada || "",
                variacion_salida: asistencia?.variacion_salida || "",
                verificacion: asistencia?.verificacion || "",
                tiempo_extra: asistencia?.tiempo_extra || "",
                tipo_dia: "",
                detalle: "",
                permiso_pendiente: tienePermisoPendiente
            };

            // Catalogar el registro dependiendo la información
            if (asistencia && asistencia.entrada || asistencia && asistencia.salida) {
                const tieneRetardo = isLate(asistencia?.variacion_entrada);

                registro.tipo_dia = "Laborado";
                registro.detalle = tieneRetardo ? "Retardo" : "Presente";
            } else if (ausencia) {
                registro.tipo_dia = ausencia.tipo; // Vacaciones, Permiso, etc.
                registro.detalle = "Ausencia";
            } else {
                registro.tipo_dia = "Falta";
                registro.detalle = "Sin registro";
            }

            fullList.push(registro);
        });
    });

    // Ordenar por número de empleado
    fullList.sort((a, b) => {
        if (a.fecha === b.fecha) {
            return a.numero_empleado - b.numero_empleado;
        }
        return new Date(a.fecha) - new Date(b.fecha);
    });

    return fullList;
}