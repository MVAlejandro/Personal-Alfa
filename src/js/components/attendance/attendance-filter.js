// Servicios Supabase
import { getAttendances } from '../../services/attendance-service.js'; 
import { createResumeCards } from './attendance-cards.js';
import { renderAttendancesTable } from './attendance-table.js';

let allAttendances = [];

document.addEventListener('DOMContentLoaded', async () => { 
    flatpickr("#day-filter", {
        locale: {
            ...flatpickr.l10ns.es,
            firstDayOfWeek: 0
        },
        mode: "single",
        dateFormat: "Y-m-d",
        defaultDate: new Date(),
        disable: [
            date => date.getDay() === 0
        ]
    });
 })

// Función de filtrado por valores seleccionados
export async function attendanceFilter() {
    // Verificar que existen los elementos
    const dayFilterEl = document.getElementById('day-filter');

    if (!dayFilterEl) return;

    // Tomar valores de los selects
    const dayFilter = dayFilterEl.value ? dayFilterEl.value.split(', ').map(d => d.trim()) : [];

    // Si no se selecciona un día generar tabla vacía
    if (dayFilter.length === 0) {
        renderAttendancesTable([]);
        return;
    }

    // Obtener registros
    allAttendances = await getAttendances();
        if (!allAttendances) return;

    // Filtrar por día y empleado seleccionado
    const filtered = allAttendances.filter(a => 
        (dayFilter.length === 0 || dayFilter.includes(a.fecha_asistencia)));

    // Generar tabla y cards con los registros filtrados
    renderAttendancesTable(filtered);
    createResumeCards(filtered)
    
    return filtered
}
