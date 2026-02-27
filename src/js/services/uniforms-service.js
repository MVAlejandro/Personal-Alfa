import supabase from '../supabase/supabase-client.js'

// Función para insertar nuevos uniformes
export async function createUniforms(uniformsData) {
    const { data, error } = await supabase
        .from('rh_uniformes_entregados')
        .insert([uniformsData]);

    if (error) {
        console.error(error);
        throw error;
    } 
}

// Función para obtener uniformes
export async function getUniforms() {
    const { data, error } = await supabase
        .from('rh_uniformes_entregados')
        .select(`
            id_uniforme,
            tipo_prenda,
            talla,
            cantidad,
            fecha_entrega,
            observaciones,
            id_empleado,
            rh_empleados (numero_empleado, nombre, puesto)
            `);
    
    if (error) {
        console.error('Error obteniendo entregas de uniformes:', error);
        throw error;
    }
    
    return data.map(uniforme => ({
        id_uniforme: uniforme.id_uniforme,
        tipo_prenda: uniforme.tipo_prenda,
        talla: uniforme.talla,
        cantidad: uniforme.cantidad,
        fecha_entrega: uniforme.fecha_entrega,
        observaciones: uniforme.observaciones,
        id_empleado: uniforme.id_empleado,
        numero_empleado: uniforme.rh_empleados?.numero_empleado,
        nombre: uniforme.rh_empleados?.nombre,
        puesto: uniforme.rh_empleados?.puesto
    }));
}

// Función para editar uniformes de la base
export async function updateUniforms(id_uniforme, updatedData) {
    const { data, error } = await supabase
        .from('rh_uniformes_entregados')
        .update(updatedData)
        .eq('id_uniforme', id_uniforme);

    if (error) {
        console.error('Error al actualizar:', error);
        alert('Error al actualizar la entrega de uniforme: ' + error.message);
    }
}

// Función para eliminar uniformes de la base
export async function deleteUniforms(idUniforms) {
    if (!idUniforms) {
        alert('No se pudo obtener el ID de la entrega de uniforme a eliminar.');
        return;
    }

    const { error } = await supabase
        .from('rh_uniformes_entregados')
        .delete()
        .eq('id_uniforme', idUniforms);

    if (error) {
        console.error('Error eliminando uniforme:', error);
        alert('Ocurrió un error al eliminar la entrega de uniforme.');
        return;
    }
};