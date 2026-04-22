import supabase from '../supabase/supabase-client.js'
// Utilidades
import { findExtraTimeDay } from './extra-time-service.js';

// Función para insertar nuevas asistencias
export async function createAttendance(attendanceData) {
    const { data, error } = await supabase
        .from('rh_asistencias')
        .insert([attendanceData]);

    if (error) {
        if (error.code === '23505' || error.code === 23505) {
            // Si el registro está duplicado ignorarlo
            return { inserted: false, duplicate: true };
        }
        console.error(error);
        throw error;
    }

    return { inserted: true, duplicate: false, data };
}

// Función para obtener asistencias de una fecha especificada
export async function getSingleAttendances(date) {
    const { data, error } = await supabase
        .from('rh_asistencias')
        .select(`
            id_asistencia,
            fecha_asistencia,
            hora_asistencia,
            tipo,
            variacion,
            dia,
            verificación,
            
            id_empleado,
            rh_empleados (numero_empleado, nombre, puesto)
            `)
        .eq('fecha_asistencia', date)
        .order('fecha_asistencia', { ascending: true })
        .order('hora_asistencia', { ascending: true })
    
    if (error) {
        console.error('Error obteniendo asistencias:', error);
        throw error;
    }
    
    return data.map(asistencia => ({
        id_asistencia: asistencia.id_asistencia,
        fecha_asistencia: asistencia.fecha_asistencia,
        hora_asistencia: asistencia.hora_asistencia,
        tipo: asistencia.tipo,
        variacion: asistencia.variacion,
        dia: asistencia.dia,
        verificación: asistencia.verificación,
        id_empleado: asistencia.id_empleado,
        numero_empleado: asistencia.rh_empleados?.numero_empleado,
        nombre: asistencia.rh_empleados?.nombre,
        puesto: asistencia.rh_empleados?.puesto
    }));
}

// Función para obtener asistencias de una fecha especificada
export async function getRangeAttendances(startDate, endDate) {
    let query = supabase
        .from('rh_asistencias')
        .select(`
            id_asistencia,
            fecha_asistencia,
            hora_asistencia,
            tipo,
            variacion,
            dia,
            verificación,
            id_empleado,
            rh_empleados (numero_empleado, nombre, puesto)
        `);

    if (startDate) {
        query = query.gte('fecha_asistencia', startDate);

        if (endDate) {
            query = query.lte('fecha_asistencia', endDate);
        } else {
            query = query.lte('fecha_asistencia', startDate);
        }
    }

    const { data, error } = await query
        .order('fecha_asistencia', { ascending: true })
        .order('hora_asistencia', { ascending: true })
        .order('id_empleado', { ascending: true });

    if (error) {
        console.error('Error obteniendo asistencias:', error);
        throw error;
    }
    
    return data.map(asistencia => ({
        id_asistencia: asistencia.id_asistencia,
        fecha_asistencia: asistencia.fecha_asistencia,
        hora_asistencia: asistencia.hora_asistencia,
        tipo: asistencia.tipo,
        variacion: asistencia.variacion,
        dia: asistencia.dia,
        verificación: asistencia.verificación,
        id_empleado: asistencia.id_empleado,
        numero_empleado: asistencia.rh_empleados?.numero_empleado,
        nombre: asistencia.rh_empleados?.nombre,
        puesto: asistencia.rh_empleados?.puesto
    }));
}

// Función para obtener toda la lista de asistencia en base a empleados activos y registros de asistencia
export async function getFormatedAttendances(staffList, allAttendances) {
    const grouped = {};

    // Agrupar por empleado + fecha
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

    // Obtener fechas únicas
    const uniqueDates = [...new Set(formattedAttendances.map(a => a.fecha))];

    // Crear mapa por empleado + fecha
    const attendanceMap = {};
    formattedAttendances.forEach(a => {
        const key = `${a.id_empleado}-${a.fecha}`;
        attendanceMap[key] = a;
    });

    // Construir lista completa (con faltantes)
    const fullList = [];

    uniqueDates.forEach(fecha => {
        staffList.forEach(emp => {
            const key = `${emp.id_empleado}-${fecha}`;

            if (attendanceMap[key]) {
                fullList.push(attendanceMap[key]);
            } else {
                fullList.push({
                    id_empleado: emp.id_empleado,
                    numero_empleado: emp.numero_empleado,
                    nombre: emp.nombre,
                    puesto: emp.puesto,
                    fecha,
                    dia: "",
                    entrada: "",
                    salida: "",
                    variacion_entrada: "",
                    variacion_salida: "",
                    verificacion: "",
                    tiempo_extra: ""
                });
            }
        });
    });

    // Ordenar por fecha
    fullList.sort((a, b) => {
        if (a.fecha === b.fecha) {
            return a.numero_empleado - b.numero_empleado;
        }
        return new Date(a.fecha) - new Date(b.fecha);
    });

    return fullList;
}
