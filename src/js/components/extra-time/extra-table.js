// Servicios Supabase
import { findExtraTime } from "../../services/extra-time-service"; 

// Función para crear la tabla y la paginación
export async function renderExtraTimeTable(idStaff) {
    // Obtener horarios si no se pasa una lista filtrada
    const allExtraTimes = await findExtraTime(idStaff);
    
    const tbody = document.querySelector('#extra-table tbody');

    // Limpiar tabla antes de insertar
    tbody.innerHTML = '';

    if (!allExtraTimes || allExtraTimes.length === 0) {
        tbody.innerHTML = `<tr><td class="text-center" colspan="4">Sin horas extra registradas</td></tr>`;
        return;
    }

    for (const extraT of allExtraTimes) {
        tbody.innerHTML +=
        `<tr>
            <td class="extra-id fw-bold p-1 text-center">${extraT.id_extra}</td>
            <td class="extra-date p-1 ps-2">${extraT.fecha}</td>
            <td class="extra-time p-1 ps-2">${extraT.tiempo.slice(0, 5)}</td>
            <td class="extra-observations p-1 ps-2">${extraT.observaciones}</td>
        </tr>`;
    };
}