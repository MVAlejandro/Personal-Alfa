// Servicios Supabase
import { getUniforms } from '../../services/uniforms-service.js'; 
import { renderUniformsTable } from './uniforms-table.js'; 

let allUniforms = [];

// Función de filtrado por valores seleccionados
export async function uniformsFilter() {
    const searchText = document.getElementById('search-filter').value.trim().toLowerCase();
    const dateStart = document.getElementById('date-start').value;
    const dateEnd = document.getElementById('date-end').value;

    // Obtener entregas
    allUniforms = await getUniforms();
        if (!allUniforms) return;

    // Ordenar por fecha
    allUniforms.sort((a, b) => new Date(a.fecha_entrega) - new Date(b.fecha_entrega));

    // Si no hay filtros activos, mostrar todo
    const filterClean = dateStart === '' && dateEnd === '' && searchText === '';

    if (filterClean) {
        renderUniformsTable(allUniforms);
        return;
    }

    // Aplicar filtros
    const filtered = allUniforms.filter(u => {
        const searchOk = searchText === '' || u.numero_empleado?.toString().toLowerCase().includes(searchText) || u.nombre?.toString().toLowerCase().includes(searchText);
        
        const uniformDate = new Date(u.fecha_entrega);
        const startOk = !dateStart || uniformDate >= new Date(dateStart);
        const endOk = !dateEnd || uniformDate <= new Date(dateEnd);

        return searchOk && startOk && endOk;
    });

    renderUniformsTable(filtered);
}
