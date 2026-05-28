import supabase from '../supabase/supabase-client.js'

// Función para insertar tiempo extra
export async function createExtraTime(extraTData) {
    const { data, error } = await supabase
        .from('rh_tiempo_extra')
        .insert([extraTData]);

    if (error) {
        console.error(error);
        throw error;
    }
}

// Función para obtener las horas extra de los empleados activos
export async function getExtraTime() {
    const { data, error } = await supabase
        .from('rh_tiempo_extra')
        .select(`
            id_extra,
            fecha,
            tiempo,
            observaciones,
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
        console.error('Error obteniendo horas extra:', error);
        throw error;
    }
    
    return data.map(extra => {
        return {
            id_extra: extra.id_extra,
            fecha: extra.fecha,
            tiempo: extra.tiempo,
            observaciones: extra.observaciones,
            id_empleado: extra.id_empleado,
            numero_empleado: extra.rh_empleados?.numero_empleado,
            nombre: extra.rh_empleados?.nombre,
            puesto: extra.rh_empleados?.puesto,
            estatus: extra.rh_empleados?.estatus
        };
    });
}

// Función para obtener las horas extra de un empleado solamente
export async function findExtraTime(id_empleado) {
    const { data, error } = await supabase
        .from('rh_tiempo_extra')
        .select(`*, rh_empleados (numero_empleado, nombre)`)
        .eq('id_empleado', id_empleado)
        .order('fecha', { ascending: true });
    
    if (error) {
        console.error('Error obteniendo horas extra:', error);
        throw error;
    }
    
    return data.map(record  => ({
        ...record ,
        numero_empleado: record.rh_empleados?.numero_empleado,
        nombre: record.rh_empleados?.nombre
    }));
}

// Función para verificar si hay horas extra de un empleado en una fecha especificada
export async function findExtraTimeDay(id_empleado, fecha) {
    const { data, error } = await supabase
        .from('rh_tiempo_extra')
        .select("*")
        .eq('id_empleado', id_empleado)
        .eq('fecha', fecha)
        .eq('estado', "Aceptado")
        .maybeSingle();
    
    if (error) {
        console.error('Error obteniendo horas extra:', error);
        throw error;
    }
    
    return data?.tiempo || 0;
}

// Función para editar registros de horas extra
export async function updateExtraTime(id_extra, updatedData) {
    const { data, error } = await supabase
        .from('rh_tiempo_extra')
        .update(updatedData)
        .eq('id_extra', id_extra);

    if (error) {
        console.error('Error al actualizar:', error);
        alert('Error al actualizar el registro: ' + error.message);
    }
}
