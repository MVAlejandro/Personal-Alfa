import supabase from '../supabase/supabase-client.js'
// Servicios Supabase
import { getActiveStaff } from './staff-service.js';

// Función para insertar nuevas asistencias
export async function createAttendance(attendanceData) {
    const { data, error } = await supabase
        .from('rh_asistencias')
        .insert([attendanceData]);

    if (error) {
        console.error(error);
        throw error;
    } 
}

// Función para obtener asistencias
export async function getAttendances() {
    const { data, error } = await supabase
        .from('rh_asistencias')
        .select(`
            id_asistencia,
            fecha_asistencia,
            hora_asistencia,
            verificación,
            
            id_empleado,
            rh_empleados (numero_empleado, nombre, puesto)
            `)
        .order('id_empleado', { ascending: true })  
        .order('fecha_asistencia', { ascending: true })
        .order('hora_asistencia', { ascending: true });
    
    if (error) {
        console.error('Error obteniendo asistencias:', error);
        throw error;
    }
    
    return data.map(asistencia => ({
        id_asistencia: asistencia.id_asistencia,
        fecha_asistencia: asistencia.fecha_asistencia,
        hora_asistencia: asistencia.hora_asistencia,
        verificación: asistencia.verificación,
        id_empleado: asistencia.id_empleado,
        numero_empleado: asistencia.rh_empleados?.numero_empleado,
        nombre: asistencia.rh_empleados?.nombre,
        puesto: asistencia.rh_empleados?.puesto
    }));
}

// Función para editar asistencias de la base
export async function updateAttendance(id_asistencia, updatedData) {
    const { data, error } = await supabase
        .from('rh_asistencias')
        .update(updatedData)
        .eq('id_asistencia', id_asistencia);

    if (error) {
        console.error('Error al actualizar:', error);
        alert('Error al actualizar la asistencia: ' + error.message);
    }
}

// Función para eliminar asistencias de la base
export async function deleteAttendance(idAttendance) {
    if (!idAttendance) {
        alert('No se pudo obtener el ID del registro de asistencia a eliminar.');
        return;
    }

    const { error } = await supabase
        .from('rh_asistencias')
        .delete()
        .eq('id_asistencia', idAttendance);

    if (error) {
        console.error('Error eliminando asistencia:', error);
        alert('Ocurrió un error al eliminar la asistencia.');
        return;
    }
};

// Función para obtener asistencias
export async function findEmployee(employeeNo) {
    const { data, error } = await supabase
        .from('rh_empleados')
        .select('id_empleado, numero_empleado')
        .eq('numero_empleado', employeeNo)
        .maybeSingle();
    
    if (error) {
        console.error('Error obteniendo al empleado:', error);
        throw error;
    }
    
    return data ? data.id_empleado : null;
}

// Función para obtener toda la lista de asistencia en base a empleados activos y registros de asistencia
export async function getFullAttendances(allAttendances) {
    const activeStaff = await getActiveStaff();

    const grouped = {};

    // Agrupar asistencias por empleado + fecha
    allAttendances.forEach(a => {
        const key = `${a.id_empleado}-${a.fecha_asistencia}`;

        if (!grouped[key]) {
            grouped[key] = {
                id_empleado: a.id_empleado,
                numero_empleado: a.numero_empleado,
                nombre: a.nombre,
                puesto: a.puesto,
                fecha: a.fecha_asistencia,
                horas: [],
                verificacion: a.verificación
            };
        }

        grouped[key].horas.push(a.hora_asistencia);
    });

    // Formatear asistencias existentes
    const formattedAttendances = Object.values(grouped).map(g => {
        const horasOrdenadas = g.horas.sort();

        return {
            id_empleado: g.id_empleado,
            numero_empleado: g.numero_empleado,
            nombre: g.nombre,
            puesto: g.puesto,
            fecha: g.fecha,
            entrada: horasOrdenadas[0] || "",
            salida: horasOrdenadas.length > 1
                ? horasOrdenadas[horasOrdenadas.length - 1]
                : "",
            verificacion: g.verificacion
        };
    });

    // Crear mapa por id_empleado para buscar rápido
    const attendanceMap = {};
    formattedAttendances.forEach(a => {
        attendanceMap[a.id_empleado] = a;
    });

    // Construir lista final incluyendo empleados sin checadas
    const fullList = activeStaff.map(emp => {
        if (attendanceMap[emp.id_empleado]) {
            return attendanceMap[emp.id_empleado];
        }

        // empleado sin registros
        return {
            id_empleado: emp.id_empleado,
            numero_empleado: emp.numero_empleado,
            nombre: emp.nombre,
            puesto: emp.puesto,
            fecha: "",
            entrada: "",
            salida: "",
            verificacion: ""
        };
    });

    return fullList;
}