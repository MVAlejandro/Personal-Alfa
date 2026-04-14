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

// Función para creear un movimiento de vacaciones
export async function createVacation(vacationsData) {
    const { data, error } = await supabase
        .from('rh_vacaciones')
        .insert([vacationsData]);

    if (error) {
        console.error(error);
        throw error;
    } 
}

// Función para obtener las ausencias que sean vacacciones
export async function getVacationAbsences() {
    const { data, error } = await supabase
        .from('rh_ausencias')
        .select('*')
        .eq('tipo', 'Vacaciones');

    if (error) throw error;
    return data;
}

// Función para obtener los movimientos de las vacacciones
export async function getVacationMovements() {
    const { data, error } = await supabase
        .from('rh_vacaciones')
        .select('*');

    if (error) throw error;
    return data;
}

// Función para obtener la lista de todos los días de vacaciones por empleado en base a registros
export async function getVacationsResume(date) {
    const activeStaff = await getActiveStaff(date);
    const movements = await getVacationMovements();
    const absences = await getVacationAbsences();
    const results = [];

    for (const emp of activeStaff) {
        const empMovements = movements.filter(
            m => m.id_empleado === emp.id_empleado
        );

        const antiguedad = calculateAntique(emp.fecha_ingreso);
        const dias_asignados = empMovements.filter(m => m.tipo === 'Asignacion').reduce((sum, m) => sum + m.dias, 0);
        const dias_tomados = empMovements.filter(m => m.tipo === 'Uso').reduce((sum, m) => sum + Math.abs(m.dias), 0);
        const saldo = dias_asignados - dias_tomados;
        const fechas_tomadas = absences.filter(a => a.id_empleado === emp.id_empleado).map(a => a.fecha).sort();

        results.push({
            id_empleado: emp.id_empleado,
            numero_empleado: emp.numero_empleado,
            nombre: emp.nombre,
            puesto: emp.puesto,
            fecha_ingreso: emp.fecha_ingreso,
            antiguedad,
            dias_asignados: calculateVacation(antiguedad),
            dias_tomados,
            saldo,
            fechas_tomadas
        });
    }

    return results;
}