// Servicios Supabase
import { getPermission } from '../../services/permissions-service.js';
import { renderPermissionsTable } from './permissions-table.js'; 

let allPermissions = [];

// Función de filtrado por valores seleccionados
export async function permissionsFilter() {
    const searchText = document.getElementById('search-filter').value.trim().toLowerCase();
    const statusFilter = document.getElementById('status-filter').value;

    // Obtener solicitudes
    allPermissions = await getPermission();
        if (!allPermissions) return;

    // Si no hay filtros activos, mostrar todo
    const filterClean = statusFilter === '' && searchText === '';

    if (filterClean) {
        renderPermissionsTable(allPermissions);
        return allPermissions;
    }

    // Aplicar filtros
    const filtered = allPermissions.filter(r => {
        const searchOk = searchText === '' || r.numero_empleado?.toString().toLowerCase().includes(searchText) || r.nombre?.toString().toLowerCase().includes(searchText);
        const statusOk = statusFilter === '0' || r.estado == statusFilter;

        return searchOk && statusOk;
    });

    renderPermissionsTable(filtered);

    return filtered;
}
