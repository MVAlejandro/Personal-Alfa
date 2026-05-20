import supabase from '../supabase/supabase-client.js'

// Función para insertar nuevas ausencias
export async function createAbsence(absencesData) {
    const { data, error } = await supabase
        .from('rh_ausencias')
        .insert([absencesData]);

    if (error) {
        console.error(error);
        throw error;
    } 
}

// Función para obtener ausencias de una fecha especificada con posibilidad de rango
export async function getAbsences(startDate = null, endDate = null) {
    let query = supabase
        .from('rh_ausencias')
        .select(`
            id_ausencia,
            fecha,
            tipo,
            id_permiso,
            id_empleado,
            rh_empleados (
                numero_empleado, 
                nombre, 
                puesto, 
                fecha_ingreso)
        `)

    // Si solo mandan una fecha
    if (startDate && !endDate) {
        query = query.eq('fecha', startDate);
    }

    // Si mandan rango
    if (startDate && endDate) {
        query = query
            .gte('fecha', startDate)
            .lte('fecha', endDate);
    }

    const { data, error } = await query
        .order('fecha', { ascending: true })
        .order('id_empleado', { ascending: true });

    if (error) {
        console.error('Error obteniendo ausencias:', error);
        throw error;
    }
    
    return data.map(ausencia => ({
        id_ausencia: ausencia.id_ausencia,
        fecha: ausencia.fecha,
        tipo: ausencia.tipo,
        id_permiso: ausencia.id_permiso,
        id_empleado: ausencia.id_empleado,
        numero_empleado: ausencia?.rh_empleados?.numero_empleado,
        nombre: ausencia?.rh_empleados?.nombre,
        puesto: ausencia?.rh_empleados?.puesto,
        fecha_ingreso: ausencia?.rh_empleados?.fecha_ingreso
    }));
}
