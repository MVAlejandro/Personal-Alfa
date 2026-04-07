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
        .select("*")
        .order('id_empleado', { ascending: true });
    
    if (error) {
        console.error('Error obteniendo empleados:', error);
        throw error;
    }
    
    return data;
}

// Función para obtener empleados activos
export async function getActiveStaff() {
    const { data, error } = await supabase
        .from('rh_empleados')
        .select(`
            id_empleado,
            numero_empleado,
            nombre,
            puesto,
            fecha_ingreso,
            estatus,
            id_departamento,
            rh_departamentos (nombre)
            `)
        .eq('estatus', 'Activo')
        .order('id_empleado', { ascending: true });
    
    if (error) {
        console.error('Error obteniendo empleados activos:', error);
        throw error;
    }
    
    return data.map(empleado => {
        return {
            id_empleado: empleado.id_empleado,
            numero_empleado: empleado.numero_empleado,
            nombre: empleado.nombre,
            puesto: empleado.puesto,
            fecha_ingreso: empleado.fecha_ingreso,
            estatus: empleado.estatus,
            id_departamento: empleado.id_departamento,
            departamento: empleado?.rh_departamentos?.nombre
        };
    });
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
