import supabase from '../supabase/supabase-client.js'

// Función para insertar nuevas permisos
export async function createPermission(permissionData) {
    const { data, error } = await supabase
        .from('rh_permisos_ausencia')
        .insert([permissionData])
        .select()
        .single();

    if (error) {
        console.error(error);
        throw error;
    } 

    return data;
}

// Función para obtener permisos
export async function getPermission() {
    const { data, error } = await supabase
        .from('rh_permisos_ausencia')
        .select(`
            id_permiso,
            fecha_solicitud,
            fechas_solicitadas,
            tipo,
            estado,
            observaciones,
            id_empleado,
            rh_empleados (
                numero_empleado, 
                nombre, 
                puesto, 
                fecha_ingreso)
            `)
        .order('id_permiso', { ascending: true });
    
    if (error) {
        console.error('Error obteniendo permisos de ausencia:', error);
        throw error;
    }

    const actualDate = new Date();

    return data.map(permiso => {
        const entryDate = new Date(permiso.rh_empleados.fecha_ingreso);

        let antiguedad = actualDate.getFullYear() - entryDate.getFullYear();

        // Si aún no se cumple el aniversario este año, resta 1
        if (actualDate.getMonth() < entryDate.getMonth() ||
            (actualDate.getMonth() === entryDate.getMonth() && actualDate.getDate() < entryDate.getDate())) {
            antiguedad--;
        }

        return {
            id_permiso: permiso.id_permiso,
            fecha_solicitud: permiso.fecha_solicitud,
            fechas_solicitadas: permiso.fechas_solicitadas,
            tipo: permiso.tipo,
            estado: permiso.estado,
            observaciones: permiso.observaciones,
            id_empleado: permiso.id_empleado,
            numero_empleado: permiso.rh_empleados?.numero_empleado,
            nombre: permiso.rh_empleados?.nombre,
            puesto: permiso.rh_empleados?.puesto,
            fecha_ingreso: permiso.rh_empleados?.fecha_ingreso,
            antiguedad
        };
    });
}

// Función para editar permisos de la base
export async function updatePermission(id_permiso, updatedData) {
    const { data, error } = await supabase
        .from('rh_permisos_ausencia')
        .update(updatedData)
        .eq('id_permiso', id_permiso);

    if (error) {
        console.error('Error al actualizar:', error);
        alert('Error al actualizar el permiso de ausencia: ' + error.message);
    }
}

// Función para eliminar permisos de la base
export async function deletePermission(idPermission) {
    if (!idPermission) {
        alert('No se pudo obtener el ID del permiso de ausencia.');
        return;
    }

    const { error } = await supabase
        .from('rh_permisos_ausencia')
        .delete()
        .eq('id_permiso', idPermission);

    if (error) {
        console.error('Error eliminando permiso de ausencia:', error);
        alert('Ocurrió un error al eliminar el permiso de ausencia.');
        return;
    }
};