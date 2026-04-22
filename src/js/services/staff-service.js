import supabase from '../supabase/supabase-client.js'

// Función para insertar nuevos empleados
export async function createStaff(staffData) {
    const { data, error } = await supabase
        .from('rh_empleados')
        .insert([staffData]);

    if (error) {
        console.error(error);
        throw error;
    }
}

// Función para obtener empleados
export async function getStaff() {
    const { data, error } = await supabase
        .from('rh_empleados')
        .select(`*, rh_departamentos (nombre)`)
        .order('numero_empleado', { ascending: true });
    
    if (error) {
        console.error('Error obteniendo empleados:', error);
        throw error;
    }
    
    return data.map(emp => ({
        ...emp,
        departamento: emp.rh_departamentos?.nombre
    }));
}

// Función para obtener empleados activos
export async function getActiveStaff(fecha) {
    const { data, error } = await supabase
        .from('rh_empleados')
        .select(`
            id_empleado,
            numero_empleado,
            nombre,
            puesto,
            fecha_ingreso,
            fecha_baja,
            estatus,
            id_departamento,
            rh_departamentos (nombre)
        `)
        .lte('fecha_ingreso', fecha)
        .or(`fecha_baja.is.null,fecha_baja.gte.${fecha}`)
        .neq('estatus', 'Pendiente')
        .order('numero_empleado', { ascending: true });

    if (error) {
        console.error('Error obteniendo empleados por fecha:', error);
        throw error;
    }

    return data.map(empleado => ({
        id_empleado: empleado.id_empleado,
        numero_empleado: empleado.numero_empleado,
        nombre: empleado.nombre,
        puesto: empleado.puesto,
        fecha_ingreso: empleado.fecha_ingreso,
        fecha_baja: empleado.fecha_baja,
        estatus: empleado.estatus,
        id_departamento: empleado.id_departamento,
        departamento: empleado?.rh_departamentos?.nombre
    }));
}

// Función para obtener empleados activos con un rango de fechas
export async function getActiveStaffRange(fechaInicio, fechaFin) {
    const { data, error } = await supabase
        .from('rh_empleados')
        .select(`
            id_empleado,
            numero_empleado,
            nombre,
            puesto,
            fecha_ingreso,
            fecha_baja,
            id_departamento,
            rh_departamentos (nombre)
        `)
        // Entró antes de que termine el rango
        .lte('fecha_ingreso', fechaFin)
        // No salió antes de que empezara el rango
        .or(`fecha_baja.is.null,fecha_baja.gte.${fechaInicio}`)
        .neq('estatus', 'Pendiente')
        .order('numero_empleado', { ascending: true });

    if (error) {
        console.error('Error obteniendo empleados por rango:', error);
        throw error;
    }

    return data;
}

//Función para obtener toda la información de un empleado por id
export async function findStaff(idStaff) {
    const { data, error } = await supabase
        .from('rh_empleados')
        .select("*")
        .eq('id_empleado', idStaff)
        .maybeSingle();
    
    if (error) {
        console.error('Error obteniendo empleados:', error);
        throw error;
    }
    
    return data;
}

// Función para encontrar el id_empleado basado en el numero de empleado
export async function findStaffNumber(staffNo) {
    const { data, error } = await supabase
        .from('rh_empleados')
        .select('id_empleado, numero_empleado')
        .eq('numero_empleado', staffNo)
        .maybeSingle();
    
    if (error) {
        console.error('Error obteniendo al empleado:', error);
        throw error;
    }
    
    return data ? data.id_empleado : null;
}

// Función para editar empleados de la base
export async function updateStaff(id_empleado, updatedData) {
    const { data, error } = await supabase
        .from('rh_empleados')
        .update(updatedData)
        .eq('id_empleado', id_empleado);

    if (error) {
        console.error('Error al actualizar:', error);
        alert('Error al actualizar al empleado: ' + error.message);
    }
}

// Función para eliminar empleados de la base
export async function deleteStaff(idStaff) {
    if (!idStaff) {
        alert('No se pudo obtener el ID del empleado a eliminar.');
        return;
    }

    const { error } = await supabase
        .from('rh_empleados')
        .delete()
        .eq('id_empleado', idStaff);

    if (error) {
        console.error('Error eliminando empleado:', error);
        alert('Ocurrió un error al eliminar al empleado.');
        return;
    }
};
