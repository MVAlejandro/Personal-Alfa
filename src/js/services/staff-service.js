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

// Función para obtener empleados activos a partir de una fecha establecida y con la posibilidad de usar rango
export async function getActiveStaff(fechaInicio, fechaFin = null) {
    // Si no viene fechaFin, usar la misma fecha
    const fechaFinal = fechaFin || fechaInicio;

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
            rh_departamentos (nombre),
            rh_horarios (
                dia,
                entrada,
                salida
            ),
            rh_permisos_ausencia (estado, fechas_solicitadas)
        `)
        // Entró antes de terminar el periodo
        .lte('fecha_ingreso', fechaFinal)

        // No salió antes de iniciar el periodo
        .or(`fecha_baja.is.null,fecha_baja.gte.${fechaInicio}`)

        .neq('estatus', 'Pendiente')
        .order('numero_empleado', { ascending: true });

    if (error) {
        console.error('Error obteniendo empleados activos:', error);
        throw error;
    }

    return data.map(empleado => {
        const diasDescanso = empleado.rh_horarios
            ?.filter(h => h.entrada === '00:00:00' || h.salida === '00:00:00')
            .map(h => h.dia) || [];

        const permisos = empleado.rh_permisos_ausencia
            ?.filter(p => p.estado === "Pendiente")
            ?.flatMap(p => p.fechas_solicitadas || []) || [];

        return {
            id_empleado: empleado.id_empleado,
            numero_empleado: empleado.numero_empleado,
            nombre: empleado.nombre,
            puesto: empleado.puesto,
            fecha_ingreso: empleado.fecha_ingreso,
            fecha_baja: empleado.fecha_baja,
            estatus: empleado.estatus,
            id_departamento: empleado.id_departamento,
            departamento: empleado?.rh_departamentos?.nombre,
            dias_descanso: diasDescanso,
            permisos: permisos
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
