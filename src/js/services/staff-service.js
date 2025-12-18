import supabase from '../supabase/supabase-client.js'

// Función para insertar nuevos empleados
export async function createStaff(staffData) {
    const { data, error } = await supabase
        .from('per_empleados')
        .insert([staffData]);

    if (error) {
        console.error(error);
        throw error;
    } 
}

// Función para obtener empleados
export async function getStaff() {
    const { data, error } = await supabase
        .from('per_empleados')
        .select("*");
    
    if (error) {
        console.error('Error obteniendo empleados:', error);
        throw error;
    }
    
    return data.map(empleado => ({
        id_empleado: empleado.id_empleado,
        numero_empleado: empleado.numero_empleado,
        nombre: empleado.nombre,
        puesto: empleado.puesto,
        fecha_nacimiento: empleado.fecha_nacimiento,
        telefono: empleado.telefono,
        fecha_ingreso: empleado.fecha_ingreso,
        nss: empleado.nss,
        rfc: empleado.rfc,
        curp: empleado.curp,
        direccion: empleado.direccion,
        estatus: empleado.estatus,
        nombre_emergencia: empleado.nombre_emergencia,
        parentesco_emergencia: empleado.parentesco_emergencia,
        telefono_emergencia: empleado.telefono_emergencia,
        tipo_sangre: empleado.tipo_sangre,
        enfermedad: empleado.enfermedad,
        medicamento: empleado.medicamento,
        alergia: empleado.alergia,
        calzado: empleado.calzado,
        playera: empleado.playera,
        camisa: empleado.camisa,
        pantalon: empleado.pantalon
    }));
}

// Función para editar empleados de la base
export async function updateStaff(id_empleado, updatedData) {
    const { data, error } = await supabase
        .from('per_empleados')
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
        .from('per_empleados')
        .delete()
        .eq('id_empleado', idStaff);

    if (error) {
        console.error('Error eliminando empleado:', error);
        alert('Ocurrió un error al eliminar al empleado.');
        return;
    }
};