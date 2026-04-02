import supabase from '../supabase/supabase-client.js'
// Servicios Supabase
import { getActiveStaff } from './staff-service.js';

// Función para insertar un nuevo horario
export async function createSchedule(scheduleData) {
    const { data, error } = await supabase
        .from('rh_horarios')
        .insert([scheduleData]);

    if (error) {
        console.error(error);
        throw error;
    }
}

// Función para obtener los horarios de los empleados activos
export async function getSchedule() {
    const { data, error } = await supabase
        .from('rh_horarios')
        .select(`
            id_horario,
            dia,
            entrada,
            salida,
            id_empleado,
            rh_empleados (
                numero_empleado, 
                nombre, 
                puesto,
                estatus)
            `)
        .eq('rh_empleados.estatus', 'Activo')
        .order('numero_empleado', { foreignTable: 'rh_empleados', ascending: true });
    
    if (error) {
        console.error('Error obteniendo horarios:', error);
        throw error;
    }
    
    return data.map(horario => {
        return {
            id_horario: horario.id_horario,
            dia: horario.dia,
            entrada: horario.entrada,
            salida: horario.salida,
            id_empleado: horario.id_empleado,
            numero_empleado: horario.rh_empleados?.numero_empleado,
            nombre: horario.rh_empleados?.nombre,
            puesto: horario.rh_empleados?.puesto,
            estatus: horario.rh_empleados?.estatus
        };
    });
}

// Función para formatear todos los registros de horarios por empleado y día
export async function getFullSchedules(allSchedules) {
    const activeStaff = await getActiveStaff();
    const grouped = {};
    const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

    // Agrupar horarios por empleado
    activeStaff.forEach(emp => {
        grouped[emp.id_empleado] = {
            id_empleado: emp.id_empleado,
            numero_empleado: emp.numero_empleado,
            nombre: emp.nombre,
            puesto: emp.puesto,
            dias: dias.map(dia => ({
                id_horario: null,
                dia,
                entrada: null,
                salida: null
            }))
        };
    });

    // Llenar horarios existentes
    allSchedules.forEach(h => {
        const id = h.id_empleado;
        if (!grouped[id]) return;

        // Normalizar día para buscar en el arreglo
        const diaObj = grouped[id].dias.find(d => d.dia.toLowerCase() === h.dia.toLowerCase());
        if (diaObj) {
            diaObj.id_horario = h.id_horario;
            diaObj.entrada = h.entrada;
            diaObj.salida = h.salida;
        }
    });

    // Convertir a array
    return Object.values(grouped);
}

// Función para obtener el horario de un empleado del día especificado
export async function findSchedule(id_empleado, dia) {
    const { data, error } = await supabase
        .from('rh_horarios')
        .select('*')
        .eq('id_empleado', id_empleado)
        .eq('dia', dia)
        .maybeSingle();
    
    if (error) {
        console.error('Error obteniendo horarios:', error);
        throw error;
    }
    
    return data
}

// Función para editar horarios de la base
export async function updateSchedule(id_horario, updatedData) {
    const { data, error } = await supabase
        .from('rh_horarios')
        .update(updatedData)
        .eq('id_horario', id_horario);

    if (error) {
        console.error('Error al actualizar:', error);
        alert('Error al actualizar el horario: ' + error.message);
    }
}