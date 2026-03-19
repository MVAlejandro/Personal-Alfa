import supabase from '../supabase/supabase-client.js'
import { getActiveStaff } from './staff-service.js';

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
// Función para calcular la antigüedad con base a la fecha de ingreso
function calculateAntique(fecha_ingreso) {
    const actualDate = new Date();
    const entryDate = new Date(fecha_ingreso);
    let antiguedad = actualDate.getFullYear() - entryDate.getFullYear();

    // Si aún no se cumple el aniversario este año, resta 1
    if (actualDate.getMonth() < entryDate.getMonth() ||
        (actualDate.getMonth() === entryDate.getMonth() && actualDate.getDate() < entryDate.getDate())) {
        antiguedad--;
    }
    return antiguedad
}
// Función para determinar los días de vacaciones a gozar
function calculateVacation(antiguedad) {
    if (antiguedad <= 0) return 0;

    // Primeros 5 años (incrementa de 2 en 2)
    if (antiguedad === 1) return 12;
    if (antiguedad === 2) return 14;
    if (antiguedad === 3) return 16;
    if (antiguedad === 4) return 18;
    if (antiguedad === 5) return 20;

    // A partir del año 6
    if (antiguedad >= 6) {
        const bloques = Math.floor((antiguedad - 6) / 5);
        return 22 + (bloques * 2);
    }

    return 0;
}

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

// Función para obtener las vacacciones
export async function getVacations() {
    const { data, error } = await supabase
        .from('rh_vacaciones')
        .select(`
            id_vacacion,
            fecha,
            id_solicitud,
            rh_solicitudes_vacaciones (
                id_empleado,
                rh_empleados (
                    numero_empleado, 
                    nombre, 
                    puesto, 
                    fecha_ingreso)
            )
            `);
    
    if (error) {
        console.error('Error obteniendo vacaciones:', error);
        throw error;
    }

    return data.map(vacacion => {
        

        return {
            id_vacacion: vacacion.id_vacacion,
            fecha: vacacion.fecha,
            id_solicitud: vacacion.id_solicitud,
            id_empleado: vacacion.rh_solicitudes_vacaciones?.id_empleado,
            numero_empleado: vacacion.rh_solicitudes_vacaciones?.rh_empleados?.numero_empleado,
            nombre: vacacion.rh_solicitudes_vacaciones?.rh_empleados?.nombre,
            puesto: vacacion.rh_solicitudes_vacaciones?.rh_empleados?.puesto,
            fecha_ingreso: vacacion.rh_solicitudes_vacaciones?.rh_empleados?.fecha_ingreso
        };
    });
}

// Función para obtener la lista de todos los días de vacaciones por empleado en base a registros
export async function getVacationsResume(allVacations) {
    const activeStaff = await getActiveStaff();
    const grouped = {};

    for (const vacation of allVacations) {
        const key = vacation.id_empleado;

        // Si no existe el empleado inicializarlo en 0
        if (!grouped[key]) {
            const antiguedad = calculateAntique(vacation.fecha_ingreso);
            const dias_total = calculateVacation(antiguedad);
            grouped[key] = {
                id_empleado: vacation.id_empleado,
                numero_empleado: vacation.numero_empleado,
                nombre: vacation.nombre,
                puesto: vacation.puesto,
                fecha_ingreso: vacation.fecha_ingreso,
                antiguedad,
                dias_tomados: [],
                dias_total,
                dias_pendientes: 0
            };
        }
        // Guardar los días que ya han sido aprovados
        grouped[key].dias_tomados.push(vacation.fecha);
    }

    // Convertir a arreglo
    const formattedVacations = Object.values(grouped).map(emp => ({
        ...emp,
        dias_pendientes: emp.dias_total - emp.dias_tomados.length
    }));

    // Crear mapa para búsqueda rápida
    const vacationMap = {};
    formattedVacations.forEach(v => { vacationMap[v.id_empleado] = v; });

    // Construir lista final incluyendo empleados sin registros
    const fullList = activeStaff.map(emp => {
        if (vacationMap[emp.id_empleado]) {
            return vacationMap[emp.id_empleado];
        }

        // empleado sin vacaciones
        const antiguedad = calculateAntique(emp.fecha_ingreso);
        const dias_total = calculateVacation(antiguedad);
        return {
            id_empleado: emp.id_empleado,
            numero_empleado: emp.numero_empleado,
            nombre: emp.nombre,
            puesto: emp.puesto,
            fecha_ingreso: emp.fecha_ingreso,
            antiguedad,
            dias_tomados: [],
            dias_total,
            dias_pendientes: dias_total
        };
    });

    return fullList;
}
