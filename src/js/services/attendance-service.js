import supabase from '../supabase/supabase-client.js'
// Servicios Supabase
import { getActiveStaff } from './staff-service.js';
import { findSchedule } from './schedule-service.js';
// Utilidades
import { timeToMinutes, minutesToTime } from '../utils/time-functions.js'; 
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
            dia,
            verificación,
            
            id_empleado,
            rh_empleados (numero_empleado, nombre, puesto)
            `)
        .eq('fecha_asistencia', date)
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
        dia: asistencia.dia,
        verificación: asistencia.verificación,
        id_empleado: asistencia.id_empleado,
        numero_empleado: asistencia.rh_empleados?.numero_empleado,
        nombre: asistencia.rh_empleados?.nombre,
        puesto: asistencia.rh_empleados?.puesto
    }));
}

// Función para obtener toda la lista de asistencia en base a empleados activos y registros de asistencia
export async function getFullAttendances(allAttendances) {
    const activeStaff = await getActiveStaff();
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
                verificacion: a.verificación,
                tiempo_extra
            };
        }

        if (a.tipo === 'Entrada') grouped[key].entradas.push(a.hora_asistencia);
        if (a.tipo === 'Salida') grouped[key].salidas.push(a.hora_asistencia);
    }));

    // Formatear asistencias existentes
    const formattedAttendances = Object.values(grouped).map(g => {
        const entradasOrdenadas = g.entradas.sort();
        const salidasOrdenadas = g.salidas.sort();

        return {
            id_empleado: g.id_empleado,
            numero_empleado: g.numero_empleado,
            nombre: g.nombre,
            puesto: g.puesto,
            fecha: g.fecha,
            dia: g.dia,
            entrada: entradasOrdenadas[0] || "",
            salida: salidasOrdenadas.length > 0
                ? salidasOrdenadas[salidasOrdenadas.length - 1]
                : "",
            verificacion: g.verificacion,
            tiempo_extra: g.tiempo_extra || ""
        };
    });

    // Crear mapa por id_empleado para buscar rápido
    const attendanceMap = {};
    formattedAttendances.forEach(a => {
        attendanceMap[a.id_empleado] = a;
    });

    // Construir lista final incluyendo empleados sin checadas
    const fullList = activeStaff.map(emp => {
        return attendanceMap[emp.id_empleado] || {
            id_empleado: emp.id_empleado,
            numero_empleado: emp.numero_empleado,
            nombre: emp.nombre,
            puesto: emp.puesto,
            fecha: "",
            entrada: "",
            salida: "",
            verificacion: "",
            tiempo_extra: ""
        };
    });

    return fullList;
}

// Función para evaluar cada registro de asistencia con el horario y determinar las variaciones de tiempo
export async function addTimeVariations(fullAttendances) {
    return await Promise.all(fullAttendances.map(async (a) => {
        if (!a.entrada || !a.salida || !a.dia) {
            return {
                ...a,
                variacion_entrada: "",
                variacion_salida: ""
            };
        }

        const horario = await findSchedule(a.id_empleado, a.dia);

        if (!horario) {
            return {
                ...a,
                variacion_entrada: "",
                variacion_salida: ""
            };
        }

        const entradaReal = timeToMinutes(a.entrada);
        const salidaReal = timeToMinutes(a.salida);

        const entradaHorario = timeToMinutes(horario.entrada);
        const salidaHorario = timeToMinutes(horario.salida);

        return {
            ...a,
            variacion_entrada: minutesToTime(entradaReal - entradaHorario),
            variacion_salida: minutesToTime(salidaReal - salidaHorario)
        };
    }));
}
