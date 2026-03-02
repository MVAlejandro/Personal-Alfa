import supabase from '../supabase/supabase-client.js'

// Función para insertar nuevas solicitudes
export async function createRequest(requestData) {
    const { data, error } = await supabase
        .from('rh_solicitudes_vacaciones')
        .insert([requestData])
        .select()
        .single();

    if (error) {
        console.error(error);
        throw error;
    } 

    return data;
}

// Función para obtener solicitudes
export async function getRequest() {
    const { data, error } = await supabase
        .from('rh_solicitudes_vacaciones')
        .select(`
            id_solicitud,
            fecha_solicitud,
            fechas_solicitadas,
            estado,
            observaciones,
            id_empleado,
            rh_empleados (
                numero_empleado, 
                nombre, 
                puesto, 
                fecha_ingreso)
            `);
    
    if (error) {
        console.error('Error obteniendo solicitudes de vacaciones:', error);
        throw error;
    }

    const actualDate = new Date();

    return data.map(solicitud => {
        const entryDate = new Date(solicitud.rh_empleados.fecha_ingreso);

        let antiguedad = actualDate.getFullYear() - entryDate.getFullYear();

        // Si aún no se cumple el aniversario este año, resta 1
        if (actualDate.getMonth() < entryDate.getMonth() ||
            (actualDate.getMonth() === entryDate.getMonth() && actualDate.getDate() < entryDate.getDate())) {
            antiguedad--;
        }

        return {
            id_solicitud: solicitud.id_solicitud,
            fecha_solicitud: solicitud.fecha_solicitud,
            fechas_solicitadas: solicitud.fechas_solicitadas,
            estado: solicitud.estado,
            observaciones: solicitud.observaciones,
            id_empleado: solicitud.id_empleado,
            numero_empleado: solicitud.rh_empleados?.numero_empleado,
            nombre: solicitud.rh_empleados?.nombre,
            puesto: solicitud.rh_empleados?.puesto,
            fecha_ingreso: solicitud.rh_empleados?.fecha_ingreso,
            antiguedad
        };
    });
}

// Función para editar solicitudes de la base
export async function updateRequest(id_solicitud, updatedData) {
    const { data, error } = await supabase
        .from('rh_solicitudes_vacaciones')
        .update(updatedData)
        .eq('id_solicitud', id_solicitud);

    if (error) {
        console.error('Error al actualizar:', error);
        alert('Error al actualizar la solicitud de vacaciones: ' + error.message);
    }
}

// Función para eliminar solicitudes de la base
export async function deleteRequest(idRequest) {
    if (!idRequest) {
        alert('No se pudo obtener el ID de la solicitud de vacaciones.');
        return;
    }

    const { error } = await supabase
        .from('rh_solicitudes_vacaciones')
        .delete()
        .eq('id_solicitud', idRequest);

    if (error) {
        console.error('Error eliminando solicitud de vacaciones:', error);
        alert('Ocurrió un error al eliminar la solicitud de vacaciones.');
        return;
    }
};

// ---------------------------------------------------------------------------

// Función para insertar nuevas vacaciones
export async function createVacations(vacationsData) {
    const { data, error } = await supabase
        .from('rh_vacaciones')
        .insert([vacationsData]);

    if (error) {
        console.error(error);
        throw error;
    } 
}
