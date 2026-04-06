import supabase from '../supabase/supabase-client.js'
// Servicios Supabase
import { getActiveStaff } from './staff-service.js';

// Función para obtener las entregas de uniformes
export async function getUniforms() {
    const { data, error } = await supabase
        .from('rh_uniformes')
        .select(`
            id_uniforme,
            tipo_prenda,
            talla,
            cantidad,
            id_empleado,
            rh_empleados (numero_empleado, nombre, puesto)
            `); 
    
    if (error) {
        console.error('Error obteniendo uniformes:', error);
        throw error;
    }
    
    return data.map(uniforme => ({
        id_uniforme: uniforme.id_uniforme,
        tipo_prenda: uniforme.tipo_prenda,
        talla: uniforme.talla,
        cantidad: uniforme.cantidad,
        id_empleado: uniforme.id_empleado,
        numero_empleado: uniforme.rh_empleados?.numero_empleado,
        nombre: uniforme.rh_empleados?.nombre,
        puesto: uniforme.rh_empleados?.puesto
    }));
}

// Función para obtener la lista de todos los uniformes por empleado en base a registros
export async function getUniformsResume() {
    const activeStaff = await getActiveStaff();
    const allUniforms = await getUniforms();
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
                prendas: {}
            };
        }

        // Crear claves para guardar valores
        const tipoTallaKey = `${uniform.tipo_prenda}_${uniform.talla}`;

        // Sumar cantidad si ya existe
        if (grouped[key].prendas[tipoTallaKey]) {
            grouped[key].prendas[tipoTallaKey] += uniform.cantidad;
        } else {
            grouped[key].prendas[tipoTallaKey] = uniform.cantidad;
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
            prendas: {}
        };
    });

    return fullList;
}

// Función para actualizar el inventario de uniformes del empleado
export async function updateUniforms(id_empleado, tipo_entrega, tipo_prenda, talla, cantidad) {
    // Buscar si ya existe un registro del tipo de uniforme
    const { data: existing, error: fetchError } = await supabase
        .from('rh_uniformes')
        .select('cantidad')
        .eq('id_empleado', id_empleado)
        .eq('tipo_prenda', tipo_prenda)
        .eq('talla', talla)
        .maybeSingle();

    if (fetchError) {
        console.error('Error al consultar:', fetchError);
        return;
    }

    let nuevaCantidad = 0;
    if(tipo_entrega == "Entrega") {
        nuevaCantidad = (existing?.cantidad || 0) + cantidad;
    } else if(tipo_entrega == "Devolución") {
        nuevaCantidad = (existing?.cantidad || 0) - cantidad;
        if (nuevaCantidad < 0) nuevaCantidad = 0; // Evitar cantidad negativa
    }
    
    // Actualizar con la nueva cantidad acumulada
    const { error } = await supabase
        .from('rh_uniformes')
        .upsert(
            {
                id_empleado,
                tipo_prenda,
                talla,
                cantidad: nuevaCantidad
            },
            { onConflict: ['id_empleado', 'tipo_prenda', 'talla'] }
        );

    if (error) {
        console.error('Error al actualizar:', error);
        alert('Error al actualizar la entrega de uniforme: ' + error.message);
    }
}