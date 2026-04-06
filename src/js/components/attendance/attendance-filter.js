// Servicios Supabase
import { getFormatedAttendances, getSingleAttendances } from '../../services/attendance-service.js'; 
import { createResumeCards } from './attendance-cards.js';
import { renderAttendancesTable } from './attendance-table.js';

let allAttendances = [];

document.addEventListener('DOMContentLoaded', async () => { 
    const today = new Date().toISOString().split("T")[0]
    document.getElementById('day-filter').value = today;
 })

// Función de filtrado por valores seleccionados
export async function attendanceFilter() {
    // Obtener el filtro de fecha
    const dayFilterEl = document.getElementById('day-filter');
    const dayFilter = dayFilterEl.value ? dayFilterEl.value.split(', ').map(d => d.trim()) : [];

    // Obtener filtro de estado por el radio seleccionado
    const statusFilter = document.querySelector('input[name="attendance-select"]:checked')?.value || '0';

    // Obtener registros filtrados por fecha
    allAttendances = await getSingleAttendances(dayFilter);
    // Agrupar los registros de asistencia por empleado con sus horas de checado
    const fullAttendances = await getFormatedAttendances(allAttendances);

    // Filtrar por el estado seleccionado
    const filtered = fullAttendances.filter(a => {
        if (statusFilter === 'Total') return true;
        if (statusFilter === 'Ausencias') {
            return !a.entrada && !a.salida;
        }
        if (statusFilter === 'Presentes') {
            return !!a.entrada || !!a.salida;
        }
        if (statusFilter === 'Retardos') {
        if (!a.entrada || !a.variacion_entrada) return false;
            // Extraer los minutos positivos de variacion_entrada
            const match = a.variacion_entrada.match(/([+-])(\d{2}):(\d{2})/);
            if (!match) return false;

            const sign = match[1]; // + o -
            const hours = parseInt(match[2], 10);
            const minutes = parseInt(match[3], 10);

            const totalMinutes = hours * 60 + minutes;

            // Retardo: solo positivos y más de 5 minutos
            return sign === '+' && totalMinutes > 5;
        }

        return true;
    });

    // Generar tabla y cards con los registros filtrados
    createResumeCards(fullAttendances);
    renderAttendancesTable(filtered);

    return filtered;
}
