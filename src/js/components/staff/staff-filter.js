// Servicios Supabase
import { getStaff } from '../../services/staff-service.js'; 
import { loadOptions } from '../../utils/load-select.js';
import { renderStaffList } from './staff-list.js'; 

let allStaff = [];

// Cargar los departamentos en el select al iniciar la página
document.addEventListener('DOMContentLoaded', async () => {
    loadOptions('departament-filter', "rh_departamentos", 'id_departamento', 'nombre')
})

// Función de filtrado por búsqueda
export async function staffFilter() {
    const searchText = document.getElementById('search-filter').value.trim().toLowerCase();
    const departamentFilter = document.getElementById('departament-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    // Obtener empleados
    allStaff = await getStaff();
        if (!allStaff) return;

    // Si no hay filtros activos, mostrar todo
    const filterClean = departamentFilter === '0' && statusFilter === '0' && searchText === '';

    // Si no hay filtros activos, mostrar todo
    if (filterClean) {
        renderStaffList(allStaff);
        return allStaff;
    }

    // Aplicar filtros
    const filtered = allStaff.filter(e => {
        // Filtro por búsqueda de nombre
        const searchOk = searchText === '' || e.numero_empleado?.toString().toLowerCase().includes(searchText) || e.nombre?.toString().toLowerCase().includes(searchText);
        const departamentOk = departamentFilter === '0' || e.id_departamento == departamentFilter;
        const statusOk = statusFilter === '0' || e.estatus == statusFilter;

        return searchOk && departamentOk && statusOk;
    });

    renderStaffList(filtered);

    return filtered;
}
