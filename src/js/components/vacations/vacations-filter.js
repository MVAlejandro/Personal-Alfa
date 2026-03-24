// Servicios Supabase
import { getRequest } from '../../services/vacations-service.js'; 
import { renderRequestsTable } from './vacations-table.js'; 

let allRequests = [];

// Función de filtrado por valores seleccionados
export async function requestsFilter() {
    const searchText = document.getElementById('search-filter').value.trim().toLowerCase();
    const statusFilter = document.getElementById('status-filter').value;

    // Obtener solicitudes
    allRequests = await getRequest();
        if (!allRequests) return;

    // Ordenar por id
    allRequests.sort((a, b) => new Date(a.id_solicitud) - new Date(b.id_solicitud));

    // Si no hay filtros activos, mostrar todo
    const filterClean = statusFilter === '' && searchText === '';

    if (filterClean) {
        renderRequestsTable(allRequests);
        return allRequests;
    }

    // Aplicar filtros
    const filtered = allRequests.filter(r => {
        const searchOk = searchText === '' || r.numero_empleado?.toString().toLowerCase().includes(searchText) || r.nombre?.toString().toLowerCase().includes(searchText);
        const statusOk = statusFilter === '0' || r.estado == statusFilter;

        return searchOk && statusOk;
    });

    renderRequestsTable(filtered);

    return allRequests;
}
