// Servicios Supabase
import { getFullAttendances, getSingleAttendances } from '../../services/attendance-service.js'; 
import { createResumeCards } from './attendance-cards.js';
import { renderAttendancesTable } from './attendance-table.js';

let allAttendances = [];

document.addEventListener('DOMContentLoaded', async () => { 
    const today = new Date().toISOString().split("T")[0]
    document.getElementById('day-filter').value = today;
 })

// Función de filtrado por valores seleccionados
export async function attendanceFilter() {
    // Obtener valores de filtros
    const dayFilterEl = document.getElementById('day-filter');
    const statusFilterEl = document.getElementById('status-filter');

    const dayFilter = dayFilterEl?.value ? dayFilterEl.value.split(', ').map(d => d.trim()) : [];

    const statusFilter = statusFilterEl?.value || '0';

    // Obtener todos los registros de asistencia filtrados por día
    allAttendances = await getSingleAttendances(dayFilter);
    // Agrupar los registros de asistencia por empleado con sus horas de checado
    const fullAttendances = await getFullAttendances(allAttendances);

    // Generar las cards con los registros ya filtrados
    createResumeCards(fullAttendances);

    // Filtrar el nuevo arreglo por tipo
    const typeFiltered = fullAttendances.filter(a => {
        if (statusFilter === '0') return true;

        const entrada = a.entrada;

        if (statusFilter === 'Faltas') return !entrada;
        if (statusFilter === 'Presentes') return !!entrada;
        if (statusFilter === 'Retardos') {
            if (!entrada) return false;
            return entrada > "08:05";
        }

        return true;
    });

    // Generar la tabla con los valores filtrados
    renderAttendancesTable(typeFiltered);

    return typeFiltered;
}
