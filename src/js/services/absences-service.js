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

// Función para obtener las ausencias
export async function getAbsences() {
    const { data, error } = await supabase
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
        .order('numero_empleado', { foreignTable: 'rh_empleados', ascending: true });
    
    if (error) {
        console.error('Error obteniendo ausencias:', error);
        throw error;
    }

    return data.map(ausencia => {
        return {
            id_ausencia: ausencia.id_ausencia,
            fecha: ausencia.fecha,
            tipo: ausencia.tipo,
            id_permiso: ausencia.id_permiso,
            id_empleado: ausencia.id_empleado,
            numero_empleado: ausencia?.rh_empleados?.numero_empleado,
            nombre: ausencia?.rh_empleados?.nombre,
            puesto: ausencia?.rh_empleados?.puesto,
            fecha_ingreso: ausencia?.rh_empleados?.fecha_ingreso
        };
    });
}

// Función para obtener ausencias de una fecha especificada
export async function getRangeAbsences(startDate, endDate) {
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

    if (startDate) {
        query = query.gte('fecha', startDate);
    }

    if (endDate) {
        query = query.lte('fecha', endDate);
    } else {
        query = query.lte('fecha', startDate);
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
