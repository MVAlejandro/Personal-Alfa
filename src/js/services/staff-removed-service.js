import supabase from '../supabase/supabase-client.js'

// Función para insertar nuevas bajas
export async function createRemove(removeData) {
    const { data, error } = await supabase
        .from('rh_bajas')
        .insert([removeData])
        .select()
        .single();

    if (error) {
        console.error(error);
        throw error;
    } 

    return data;
}

// Función para obtener las bajas
export async function getRemove() {
    const { data, error } = await supabase
        .from('rh_bajas')
        .select(`
            id_baja,
            fecha_baja,
            motivo,
            descripcion,
            recontratacion,
            razon,
            id_empleado,
            rh_empleados (
                numero_empleado, 
                nombre, 
                puesto, 
                fecha_ingreso)
            `)
        .order('fecha_baja', { ascending: true });
    
    if (error) {
        console.error('Error obteniendo las bajas de empleados:', error);
        throw error;
    }
    
    return data.map(baja => {
        return {
            id_baja: baja.id_baja,
            fecha_baja: baja.fecha_baja,
            motivo: baja.motivo,
            descripcion: baja.descripcion,
            recontratacion: baja.recontratacion,
            razon: baja.razon,
            id_empleado: baja.puesto,
            numero_empleado: baja?.rh_empleados?.numero_empleado,
            nombre: baja?.rh_empleados?.nombre,
            puesto: baja?.rh_empleados?.puesto,
            fecha_ingreso: baja?.rh_empleados?.fecha_ingreso
        };
    });
}

// Función para editar registros de baja de la base
export async function updateRemove(id_baja, updatedData) {
    const { data, error } = await supabase
        .from('rh_bajas')
        .update(updatedData)
        .eq('id_baja', id_baja);

    if (error) {
        console.error('Error al actualizar:', error);
        alert('Error al actualizar el registro de baja: ' + error.message);
    }
}

// Función para eliminar registros de baja de la base
export async function deleteRemove(idRemove) {
    if (!idRemove) {
        alert('No se pudo obtener el ID del registro de baja.');
        return;
    }

    const { error } = await supabase
        .from('rh_bajas')
        .delete()
        .eq('id_baja', idRemove);

    if (error) {
        console.error('Error eliminando registro de baja:', error);
        alert('Ocurrió un error al eliminar el registro de baja.');
        return;
    }
};