// Servicios Supabase
import { findExtraTime } from "../../services/extra-time-service"; 
import { validateUserRole } from "../../utils/session-validate";

// Función para crear la tabla de aprobación de tiempo extra
export async function renderPendingExtraTimeTable(idStaff) {
    // Obtener horas extra con el id del empleado
    let allExtraTimes = await findExtraTime(idStaff);
    allExtraTimes = allExtraTimes.filter(e => e.estado === "Pendiente");

    const tbody = document.querySelector('#extraP-table tbody');

    // Limpiar tabla antes de insertar
    tbody.innerHTML = '';

    if (!allExtraTimes || allExtraTimes.length === 0) {
        tbody.innerHTML = `<tr><td class="text-center" colspan="5">Sin horas extra pendientes</td></tr>`;
        return;
    }

    for (const extraT of allExtraTimes) {
        tbody.innerHTML +=
        `<tr>
            <td class="extraP-id fw-bold p-1 text-center">${extraT.id_extra}</td>
            <td class="extraP-date p-1 ps-2">${extraT.fecha}</td>
            <td class="extraP-time p-1 ps-2">${extraT.tiempo.slice(0, 5)}</td>
            <td class="extraP-observations p-1 ps-2">${extraT.observaciones}</td>
            <td class="schedule-controls text-center p-1 pe-4 d-none" data-dir-only>
                <div class="action-buttons">
                    <button class="btn btn-edit btn-extra" title="Aprobar horas extra" extra-id='${extraT.id_extra}' staff-id='${extraT.id_empleado}'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                            <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
                        </svg>
                    </button>
                    <button class="btn btn-delete btn-extra" title="Denegar horas extra" extra-id='${extraT.id_extra}' staff-id='${extraT.id_empleado}'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>`;
    };

    validateUserRole()
}

// Función para crear la tabla de aprobación de tiempo extra
export async function renderExtraTimeTable(idStaff) {
    // Obtener horas extra con el id del empleado
    let allExtraTimes = await findExtraTime(idStaff);
    allExtraTimes = allExtraTimes.filter(e => e.estado != "Pendiente");
    
    const tbody = document.querySelector('#extra-table tbody');

    // Limpiar tabla antes de insertar
    tbody.innerHTML = '';

    if (!allExtraTimes || allExtraTimes.length === 0) {
        tbody.innerHTML = `<tr><td class="text-center" colspan="5">Sin horas extra registradas</td></tr>`;
        return;
    }

    for (const extraT of allExtraTimes) {
        tbody.innerHTML +=
        `<tr>
            <td class="extra-date p-1 ps-2">${extraT.fecha}</td>
            <td class="extra-time p-1 ps-2">${extraT.tiempo.slice(0, 5)}</td>
            <td class="extra-observations p-1 ps-2">${extraT.observaciones}</td>
            <td class="extra-status p-1 ps-2">${extraT.estado}</td>
        </tr>`;
    };
}