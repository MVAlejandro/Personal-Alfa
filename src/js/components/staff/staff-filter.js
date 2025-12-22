// Servicios Supabase
import { getStaff } from '../../services/staff-service.js'; 
import { renderStaffList } from './staff-list.js'; 

let allStaff = [];

// Función de filtrado por búsqueda
export async function staffFilter() {
    const searchText = document.getElementById('search-filter').value.trim().toLowerCase();
    const statusFilter = document.getElementById('status-filter').value;
    // Obtener empleados
    allStaff = await getStaff();
        if (!allStaff) return;

    // Si no hay filtros activos, mostrar todo
    const filterClean = statusFilter === '0' && searchText === '';

    // Si no hay filtros activos, mostrar todo
    if (filterClean) {
        renderStaffList(allStaff);
        return;
    }

    // Aplicar filtros
    const filtered = allStaff.filter(e => {
        // Filtro por búsqueda de nombre
        const searchOk = searchText === '' || e.numero_empleado?.toString().toLowerCase().includes(searchText) || e.nombre?.toString().toLowerCase().includes(searchText);
        const statusOk = statusFilter === '0' || e.estatus == statusFilter;

        return searchOk && statusOk;
    });

    renderStaffList(filtered);
}
