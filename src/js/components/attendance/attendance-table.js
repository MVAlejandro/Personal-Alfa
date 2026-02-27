// Servicios Supabase
import { getAttendances } from "../../services/attendance-service";
import { validateUserRole } from '../../utils/session-validate.js';

const perPage = 20;
let currentPage = 1;
let allAttendances = [];

// Función para crear la tabla y la paginación
export async function renderAttendancesTable(attendancesParam = null) {
    // Obtener asistencias si no se pasa una lista filtrada
    if (attendancesParam) {
        allAttendances = attendancesParam;
    } else {
        allAttendances = await getAttendances();
    }
    
    const tbody = document.querySelector('#attendance-table tbody');
    const pagination = document.querySelector('#attendance-pages .pagination');
    const resultsText = document.getElementById('attendance-pages-results');

    // Calcular entradas de la página actual
    const pageStart = (currentPage - 1) * perPage;
    const pageEnd = pageStart + perPage;
    const attendance = allAttendances.slice(pageStart, pageEnd);

    // Limpiar tabla antes de insertar
    tbody.innerHTML = '';

    if (!attendance || attendance.length === 0) {
        tbody.innerHTML = `<tr><td class="text-center" colspan="8">No hay asistencias registradas</td></tr>`;
        resultsText.textContent = `Mostrando 0 de ${allAttendances.length} resultados`;
        pagination.innerHTML = '';
        return;
    }

    for (const asistencia of attendance) {
        tbody.innerHTML +=
        `<tr>
            <td class="p-3 ps-4">
                <p class="attendance-date fw-bold">${asistencia.fecha_asistencia}</p>
                <p class="attendance-time">${asistencia.hora_asistencia.slice(0, 5)}</p>
            </td>
            <td class="attendance-number p-3">${asistencia.numero_empleado}</td>
            <td class="p-3">
                <p class="attendance-employee">${asistencia.nombre}</p>
                <p class="attendance-departament">${asistencia.puesto}</p>
            </td>
            <td class="attendance-type p-3">${asistencia.verificación}</td>
        </tr>`;
    };

    // Actualizar texto de resultados
    const total = allAttendances.length;
    resultsText.textContent = `Mostrando ${Math.min(pageStart + 1, total)} a ${Math.min(pageEnd, total)} de ${total} resultados`;

    // Crear paginación
    const totalPages = Math.ceil(total / perPage);
    pagination.innerHTML = '';

    const maxVisible = 4; // máximo de botones visibles
    let startPage = Math.max(currentPage - Math.floor(maxVisible / 2), 1);
    let endPage = startPage + maxVisible - 1;
    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(endPage - maxVisible + 1, 1);
    }

    // Botón Anterior
    pagination.innerHTML += 
        `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}" data-page="prev">
            <a class="page-link" href="#">&laquo;</a>
        </li>`;

    // Primera página + ...
    if (startPage > 1) {
        pagination.innerHTML += 
            `<li class="page-item" data-page="1"><a class="page-link" href="#">1</a></li>`;
        if (startPage > 2) {
            pagination.innerHTML += 
                `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }

    // Botones centrales
    for (let i = startPage; i <= endPage; i++) {
        pagination.innerHTML += 
            `<li class="page-item ${i === currentPage ? 'active' : ''}" data-page="${i}">
                <a class="page-link" href="#">${i}</a>
            </li>`;
    }

    // Última página + ...
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pagination.innerHTML += 
                `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
        pagination.innerHTML += 
            `<li class="page-item" data-page="${totalPages}"><a class="page-link" href="#">${totalPages}</a></li>`;
    }

    // Botón Siguiente
    pagination.innerHTML += 
        `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}" data-page="next">
            <a class="page-link" href="#">&raquo;</a>
        </li>`;

    // Añadir los eventos de clic a la paginación
    pagination.querySelectorAll('.page-item').forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            const type = item.dataset.page;

            if (type === 'prev' && currentPage > 1) {
                currentPage--;
            } else if (type === 'next' && currentPage < totalPages) {
                currentPage++;
            } else if (!isNaN(parseInt(type))) {
                currentPage = parseInt(type);
            }

            renderAttendancesTable();
        });
    });
    
    validateUserRole()
}