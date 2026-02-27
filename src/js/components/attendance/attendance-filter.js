// Servicios Supabase
import { getAttendances } from '../../services/attendance-service.js'; 
import { createResumeCards } from './attendance-cards.js';
import { renderAttendancesTable } from './attendance-table.js';
// Utilidades
import { loadDaysFilter } from '../../utils/load-select.js'; 

let allAttendances = [];

document.addEventListener('DOMContentLoaded', async () => { loadDaysFilter() })

// Función de filtrado por valores seleccionados
export async function attendanceFilter() {
    // Verificar que existen los elementos
    const searchFilterEl  = document.getElementById('search-filter');
    const dayFilterEl = document.getElementById('day-filter');

    if (!searchFilterEl || !dayFilterEl) return;

    // Tomar valores de los selects
    const searchFilter = searchFilterEl.value.trim().toLowerCase();
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
        (searchFilter === ''  || a.numero_empleado?.toString().toLowerCase().includes(searchFilter) 
                              || a.nombre?.toString().toLowerCase().includes(searchFilter)) &&
        (dayFilter.length === 0 || dayFilter.includes(a.fecha_asistencia)));

    // Generar tabla y cards con los registros filtrados
    renderAttendancesTable(filtered);
    createResumeCards(filtered)
    
    return filtered
}
