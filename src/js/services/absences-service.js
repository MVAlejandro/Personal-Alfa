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
function getCurrentPeriod(fechaIngreso) {
    const today = new Date();
    const ingreso = new Date(fechaIngreso);

    let inicio = new Date(today.getFullYear(), ingreso.getMonth(), ingreso.getDate());

    // Si aún no llega el aniversario este año
    if (today < inicio) {
        inicio.setFullYear(inicio.getFullYear() - 1);
    }

    const fin = new Date(inicio);
    fin.setFullYear(fin.getFullYear() + 1);
    fin.setDate(fin.getDate() - 1);

    return { inicio, fin };
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

// Función para obtener las ausencias
export async function getAbsences() {
    const { data, error } = await supabase
        .from('rh_ausencias')
        .select(`
            id_ausencia,
            fecha,
            tipo,
            id_permiso,
            id_empleado,
            rh_empleados (
                numero_empleado, 
                nombre, 
                puesto, 
                fecha_ingreso)
            `)
        .order('numero_empleado', { foreignTable: 'rh_empleados', ascending: true });
    
    if (error) {
        console.error('Error obteniendo ausencias:', error);
        throw error;
    }

    return data.map(ausencia => {
        return {
            id_ausencia: ausencia.id_ausencia,
            fecha: ausencia.fecha,
            tipo: ausencia.tipo,
            id_permiso: ausencia.id_permiso,
            id_empleado: ausencia.id_empleado,
            numero_empleado: ausencia?.rh_empleados?.numero_empleado,
            nombre: ausencia?.rh_empleados?.nombre,
            puesto: ausencia?.rh_empleados?.puesto,
            fecha_ingreso: ausencia?.rh_empleados?.fecha_ingreso
        };
    });
}

// Función para obtener las vacacciones
export async function getVacations() {
    const { data, error } = await supabase
        .from('rh_ausencias')
        .select(`
            id_ausencia,
            fecha,
            tipo,
            id_permiso,
            id_empleado,
            rh_empleados (
                numero_empleado, 
                nombre, 
                puesto, 
                fecha_ingreso)
            `)
        .eq('tipo', 'Vacaciones')
        .order('numero_empleado', { foreignTable: 'rh_empleados', ascending: true });
    
    if (error) {
        console.error('Error obteniendo vacaciones:', error);
        throw error;
    }

    return data.map(vacacion => {
        return {
            id_ausencia: vacacion.id_ausencia,
            fecha: vacacion.fecha,
            tipo: vacacion.tipo,
            id_permiso: vacacion.id_permiso,
            id_empleado: vacacion.id_empleado,
            numero_empleado: vacacion?.rh_empleados?.numero_empleado,
            nombre: vacacion?.rh_empleados?.nombre,
            puesto: vacacion?.rh_empleados?.puesto,
            fecha_ingreso: vacacion?.rh_empleados?.fecha_ingreso
        };
    });
}

// Función para obtener la lista de todos los días de vacaciones por empleado en base a registros
export async function getVacationsResume(date) {
    const activeStaff = await getActiveStaff(date);
    const allVacations = await getVacations();

    const results = [];

    for (const emp of activeStaff) {
        const antiguedad = calculateAntique(emp.fecha_ingreso);
        const dias_total = calculateVacation(antiguedad);

        const { inicio, fin } = getCurrentPeriod(emp.fecha_ingreso);

        // Filtrar vacaciones del periodo actual
        const vacacionesActuales = allVacations.filter(v => {
            const fecha = new Date(v.fecha + 'T00:00:00'); // evita problemas de zona horaria

            return (
                v.id_empleado === emp.id_empleado &&
                fecha >= inicio &&
                fecha <= fin
            );
        });

        // Obtener fechas tomadas ordenadas
        const fechas_tomadas = vacacionesActuales
            .map(v => v.fecha)
            .sort();

        const dias_tomados = fechas_tomadas.length;
        const dias_pendientes = dias_total - dias_tomados;

        results.push({
            id_empleado: emp.id_empleado,
            numero_empleado: emp.numero_empleado,
            nombre: emp.nombre,
            puesto: emp.puesto,
            fecha_ingreso: emp.fecha_ingreso,
            antiguedad,
            dias_total,
            dias_tomados,
            dias_pendientes,
            fechas_tomadas,
            periodo_actual: {
                inicio,
                fin
            }
        });
    }

    return results;
}
