import supabase from '../supabase/supabase-client.js'
import { getActiveStaff } from './staff-service.js';

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
            `)
        .order('id_empleado', { ascending: true })  
    
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

// Función para obtener la lista de todos los uniformes por empleado en base a registros
export async function getUniformsResume(allUniforms) {
    const activeStaff = await getActiveStaff();
    const grouped = {};

    for (const uniform of allUniforms) {
        const key = uniform.id_empleado;

        // Si no existe el empleado inicializarlo en 0
        if (!grouped[key]) {
            grouped[key] = {
                id_empleado: uniform.id_empleado,
                numero_empleado: uniform.numero_empleado,
                nombre: uniform.nombre,
                puesto: uniform.puesto,
                calzado: 0,
                playera: 0,
                camisa: 0,
                pantalon: 0
            };
        }

        switch (uniform.tipo_prenda) {
            case 'Calzado':
                grouped[key].calzado += uniform.cantidad;
                break;
            case 'Playera':
                grouped[key].playera += uniform.cantidad;
                break;
            case 'Camisa':
                grouped[key].camisa += uniform.cantidad;
                break;
            case 'Pantalón':
                grouped[key].pantalon += uniform.cantidad;
                break;
        }
    }

    // Convertir a arreglo
    const formattedUniforms = Object.values(grouped);

    // Crear mapa para búsqueda rápida
    const uniformMap = {};
    formattedUniforms.forEach(u => { uniformMap[u.id_empleado] = u; });

    // Construir lista final incluyendo empleados sin registros
    const fullList = activeStaff.map(emp => {
        if (uniformMap[emp.id_empleado]) {
            return uniformMap[emp.id_empleado];
        }

        // empleado sin uniformes
        return {
            id_empleado: emp.id_empleado,
            numero_empleado: emp.numero_empleado,
            nombre: emp.nombre,
            puesto: emp.puesto,
            calzado: 0,
            playera: 0,
            camisa: 0,
            pantalon: 0
        };
    });

    return fullList;
}