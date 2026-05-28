// Servicios Supabase
import { getActiveStaff } from '../../services/staff-service.js'; 
import { getAttendances } from '../../services/attendance-service.js'; 
import { getAbsences } from '../../services/absences-service.js';
import { getCalendarEvents } from '../../services/calendar-service.js';
import { createResumeCards } from './attendance-cards.js';
import { renderAttendancesTable } from './attendance-table.js';

let allAttendances = [];
let allAbsences = [];

document.addEventListener('DOMContentLoaded', async () => { 
    const today = new Date().toLocaleDateString('en-CA')
    document.getElementById('day-filter').value = today;
 })

// Función de filtrado por valores seleccionados
export async function attendanceFilter() {
    // Obtener el filtro de fecha
    const searchInput = document.getElementById('search-filter');
    const searchText = searchInput.value.trim().toLowerCase();

    const dayFilterEl = document.getElementById('day-filter');
    const dayFilter = dayFilterEl.value ? dayFilterEl.value.split(', ').map(d => d.trim()) : [];

    // Obtener filtro de estado por el radio seleccionado
    const statusFilter = document.querySelector('input[name="attendance-select"]:checked')?.value || '0';

    // Obtener registros de asistencias y ausencias filtrados por fecha
    allAttendances = await getAttendances(dayFilter);
    allAbsences = await getAbsences(dayFilter);
    const activeStaff = await getActiveStaff(dayFilter);
    
    // Agrupar los registros de asistencia por empleado con sus horas de checado
    const fullAttendances = await getCalendarEvents(activeStaff, allAttendances, allAbsences);

    // Si se realiza la búsqueda por texto mantener la información de las cards y solo mostrar las coincidencias
    if (searchText !== "") {
        const filteredBySearch = fullAttendances.filter(a => {
            return (
                a.numero_empleado?.toString().toLowerCase().includes(searchText) ||
                a.nombre?.toString().toLowerCase().includes(searchText)
            );
        });

        renderAttendancesTable(filteredBySearch);

        // limpiar input
        searchInput.value = "";

        // mantener cards con data original
        createResumeCards(dayFilter, fullAttendances);

        return filteredBySearch;
    }

    // Filtrar por el estado seleccionado
    const filtered = fullAttendances.filter(a => {
        if (statusFilter === 'Total') return true;
        if (statusFilter === 'Ausencias') {
            return a.tipo_dia == "Falta";
        }
        if (statusFilter === 'Presentes') {
            return a.tipo_dia == "Laborado";
        }
        if (statusFilter === 'Retardos') {
            return a.tipo_dia === "Laborado" && a.detalle === "Retardo";
        }
        if (statusFilter === 'Permisos') {
            return a.tipo_dia == "Permiso" || a.tipo_dia == "Vacaciones" || a.tipo_dia == "Descanso";
        }

        return true;
    });

    // Generar tabla y cards con los registros filtrados
    createResumeCards(dayFilter, fullAttendances);
    renderAttendancesTable(filtered);

    return filtered;
}
