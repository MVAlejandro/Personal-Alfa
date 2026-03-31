import supabase from '../supabase/supabase-client.js'
import { getActiveStaff } from './staff-service.js';

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
// Función para determinar a qué período laboral pertenece una fecha de vacación
function getVacationPeriod(fechaIngreso, fechaVacacion) {
    const ingreso = new Date(fechaIngreso);
    const vacacion = new Date(fechaVacacion);
    
    let anosCompletos = vacacion.getFullYear() - ingreso.getFullYear();
    const mesIngreso = ingreso.getMonth();
    const diaIngreso = ingreso.getDate();
    const mesVacacion = vacacion.getMonth();
    const diaVacacion = vacacion.getDate();
    
    if (mesVacacion < mesIngreso || (mesVacacion === mesIngreso && diaVacacion < diaIngreso)) {
        anosCompletos--;
    }
    
    // El período es años completos
    return anosCompletos;
}

// Función para insertar nuevas ausencias
export async function createAbsence(absencesData) {
    const { data, error } = await supabase
        .from('rh_ausencias')
        .insert([absencesData]);

    if (error) {
        console.error(error);
        throw error;
    } 
}

// Función para obtener las vacacciones
export async function getVacations() {
    const { data, error } = await supabase
        .from('rh_ausencias')
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
            `)
        .order('numero_empleado', { foreignTable: 'rh_solicitudes_vacaciones.rh_empleados', ascending: true });
    
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
        
        if (!grouped[key]) {
            grouped[key] = {
                id_empleado: vacation.id_empleado,
                numero_empleado: vacation.numero_empleado,
                nombre: vacation.nombre,
                puesto: vacation.puesto,
                fecha_ingreso: vacation.fecha_ingreso,
                periodos: {}
            };
        }
        
        // Determinar a qué período pertenece esta vacación
        const periodo = getVacationPeriod(vacation.fecha_ingreso, vacation.fecha);
        
        if (!grouped[key].periodos[periodo]) {
            // Obtener los días asignados para ese período
            const diasAsignados = calculateVacation(periodo);
            grouped[key].periodos[periodo] = {
                periodo,
                dias_asignados: diasAsignados,
                dias_tomados: [],
                dias_pendientes: diasAsignados
            };
        }
        
        grouped[key].periodos[periodo].dias_tomados.push(vacation.fecha);
        grouped[key].periodos[periodo].dias_pendientes = 
            grouped[key].periodos[periodo].dias_asignados - 
            grouped[key].periodos[periodo].dias_tomados.length;
    }

    const formattedVacations = Object.values(grouped).map(emp => {
        // Obtener los años cumplidos hasta hoy
        const periodoActual = calculateAntique(emp.fecha_ingreso);
        // Obtener días asignados para el período actual
        const diasTotalActual = calculateVacation(periodoActual);
        
        const periodoActualInfo = emp.periodos[periodoActual] || {
            dias_asignados: diasTotalActual,
            dias_tomados: [],
            dias_pendientes: diasTotalActual
        };
        
        return {
            id_empleado: emp.id_empleado,
            numero_empleado: emp.numero_empleado,
            nombre: emp.nombre,
            puesto: emp.puesto,
            fecha_ingreso: emp.fecha_ingreso,
            antiguedad: periodoActual, // Período en el que está actualmente
            dias_total: diasTotalActual,
            dias_tomados_actual: periodoActualInfo.dias_tomados.length,
            dias_pendientes_actual: periodoActualInfo.dias_pendientes,
            historial_periodos: Object.values(emp.periodos)
        };
    });

    const vacationMap = {};
    formattedVacations.forEach(v => { vacationMap[v.id_empleado] = v; });

    const fullList = activeStaff.map(emp => {
        if (vacationMap[emp.id_empleado]) {
            return vacationMap[emp.id_empleado];
        }
        
        const aniosCumplidos = calculateAntique(emp.fecha_ingreso);
        const periodoActual = aniosCumplidos + 1;
        const diasTotalActual = calculateVacation(periodoActual);
        
        return {
            id_empleado: emp.id_empleado,
            numero_empleado: emp.numero_empleado,
            nombre: emp.nombre,
            puesto: emp.puesto,
            fecha_ingreso: emp.fecha_ingreso,
            antiguedad: periodoActual,
            anos_cumplidos: aniosCumplidos,
            dias_total: diasTotalActual,
            dias_tomados_actual: 0,
            dias_pendientes_actual: diasTotalActual,
            historial_periodos: []
        };
    });

    return fullList;
}
