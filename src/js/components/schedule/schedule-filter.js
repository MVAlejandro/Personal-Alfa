// Servicios Supabase
import { getSchedule, getFullSchedules } from '../../services/schedule-service.js'; 
import { renderSchedulesTable } from './schedule-table.js'; 

let allSchedules = [];
let staffSchedules = [];

// Función de filtrado por valores seleccionados
export async function schedulesFilter() {
    const today = new Date().toISOString().split("T")[0];
    const searchText = document.getElementById('search-filter').value.trim().toLowerCase();
    const statusFilter = document.getElementById('status-filter').value;

    // Obtener horarios y formatear para la tabla
    allSchedules = await getSchedule();
        if (!allSchedules) return;
    staffSchedules = await getFullSchedules(today, allSchedules);

    // Si no hay filtros activos, mostrar todo
    const filterClean = statusFilter === '' && searchText === '';

    if (filterClean) {
        renderSchedulesTable(staffSchedules);
        return staffSchedules;
    }

    const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

    // Aplicar filtros
    const filtered = staffSchedules.filter(s => {
        const searchOk = searchText === '' ||
            s.numero_empleado?.toString().toLowerCase().includes(searchText) ||
            s.nombre?.toLowerCase().includes(searchText);

        // Determinar el estado dependiendo los días con horario asignados
        const hasNull = s.dias.some(dia => !dia.entrada || !dia.salida);
        const estado = hasNull ? 'Pendiente' : 'Asignado';

        const statusOk = statusFilter === '0' || statusFilter === estado;

        return searchOk && statusOk;
    });

    renderSchedulesTable(filtered);
    
    return filtered;
}