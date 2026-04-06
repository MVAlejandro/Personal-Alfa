import supabase from '../supabase/supabase-client.js'

// Función para insertar nuevas entregas de uniformes
export async function createUniformsDeliver(deliversData) {
    const { data, error } = await supabase
        .from('rh_entregas_uniformes')
        .insert([deliversData]);

    if (error) {
        console.error(error);
        throw error;
    } 
}

// Función para obtener las entregas de uniformes
export async function getUniformsDeliver() {
    const { data, error } = await supabase
        .from('rh_entregas_uniformes')
        .select(`
            id_entrega,
            tipo_entrega,
            tipo_prenda,
            talla,
            cantidad,
            fecha_entrega,
            observaciones,
            id_empleado,
            rh_empleados (numero_empleado, nombre, puesto)
            `)
        .order('id_entrega', { ascending: true })  
    
    if (error) {
        console.error('Error obteniendo entregas de uniformes:', error);
        throw error;
    }
    
    return data.map(entrega => ({
        id_entrega: entrega.id_entrega,
        tipo_entrega: entrega.tipo_entrega,
        tipo_prenda: entrega.tipo_prenda,
        talla: entrega.talla,
        cantidad: entrega.cantidad,
        fecha_entrega: entrega.fecha_entrega,
        observaciones: entrega.observaciones,
        id_empleado: entrega.id_empleado,
        numero_empleado: entrega.rh_empleados?.numero_empleado,
        nombre: entrega.rh_empleados?.nombre,
        puesto: entrega.rh_empleados?.puesto
    }));
}

// Función para editar entregas de uniformes de la base
export async function updateUniformsDeliver(id_entrega, updatedData) {
    const { data, error } = await supabase
        .from('rh_entregas_uniformes')
        .update(updatedData)
        .eq('id_entrega', id_entrega);

    if (error) {
        console.error('Error al actualizar:', error);
        alert('Error al actualizar la entrega de uniforme: ' + error.message);
    }
}

// Función para eliminar entregas de uniformes de la base
export async function deleteUniformsDeliver(idUniforms) {
    if (!idUniforms) {
        alert('No se pudo obtener el ID de la entrega de uniforme a eliminar.');
        return;
    }

    const { error } = await supabase
        .from('rh_entregas_uniformes')
        .delete()
        .eq('id_entrega', idUniforms);

    if (error) {
        console.error('Error eliminando uniforme:', error);
        alert('Ocurrió un error al eliminar la entrega de uniforme.');
        return;
    }
};
