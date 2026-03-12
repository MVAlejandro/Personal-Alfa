// Servicios Supabase
import { getAttendances, getFullAttendances } from "../../services/attendance-service";
import { validateUserRole } from '../../utils/session-validate.js';

const perPage = 20;
let currentPage = 1;
let allAttendances = [];
let attendancesList = [];

// Función para crear la tabla y la paginación
export async function renderAttendancesTable(attendancesParam = null) {
    // Obtener asistencias si no se pasa una lista filtrada
    if (attendancesParam) {
        allAttendances = attendancesParam;
    } else {
        allAttendances = await getAttendances();
    }
    
    // Agrupar los registros de asistencia por empleado con sus horas de checado
    attendancesList = await getFullAttendances(allAttendances)

    const tbody = document.querySelector('#attendance-table tbody');
    const pagination = document.querySelector('#attendance-pages .pagination');
    const resultsText = document.getElementById('attendance-pages-results');

    // Calcular entradas de la página actual
    const pageStart = (currentPage - 1) * perPage;
    const pageEnd = pageStart + perPage;
    const attendance = attendancesList.slice(pageStart, pageEnd);
    
    // Limpiar tabla antes de insertar
    tbody.innerHTML = '';

    if (!attendance || attendance.length === 0) {
        tbody.innerHTML = `<tr><td class="text-center" colspan="8">No hay asistencias registradas</td></tr>`;
        resultsText.textContent = `Mostrando 0 de ${attendancesList.length} resultados`;
        pagination.innerHTML = '';
        return;
    }

    for (const asistencia of attendance) {
        tbody.innerHTML +=
        `<tr>
            <td class="attendance-number text-center p-2">${asistencia.numero_empleado}</td>
            <td class="p-2">
                <p class="attendance-employee">${asistencia.nombre}</p>
                <p class="attendance-departament">${asistencia.puesto}</p>
            </td>
            <td class="attendance-date fw-bold text-center p-2">${asistencia.fecha || "Sin Registro"}</td>
            <td class="attendance-entrance text-center p-2">${asistencia.entrada.slice(0, 5) || "Sin Registro"}</td>
            <td class="attendance-exit text-center p-2">${asistencia.salida.slice(0, 5) || "Sin Registro"}</td>
            <td class="attendance-type text-center p-2">${asistencia.verificacion || "Sin Registro"}</td>
        </tr>`;
    };

    // Actualizar texto de resultados
    const total = attendancesList.length;
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