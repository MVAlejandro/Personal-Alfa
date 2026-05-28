// Servicios Supabase
import { getPermission } from '../../services/permissions-service.js'; 
import { validateUserRole } from '../../utils/session-validate.js';

const perPage = 50;
let currentPage = 1;
let allPermissions = [];

// Función para crear la tabla y la paginación
export async function renderPermissionsTable(permissionParam = null) {
    // Obtener permisos de ausencia si no se pasa una lista filtrada
    if (permissionParam) {
        allPermissions = permissionParam;
    } else {
        allPermissions = await getPermission();
    }
    
    const tbody = document.querySelector('#permissions-table tbody');
    const pagination = document.querySelector('#permissions-pages .pagination');
    const resultsText = document.getElementById('permissions-pages-results');

    // Calcular entradas de la página actual
    const pageStart = (currentPage - 1) * perPage;
    const pageEnd = pageStart + perPage;
    const permissions = allPermissions.slice(pageStart, pageEnd);

    // Limpiar tabla antes de insertar
    tbody.innerHTML = '';

    if (!permissions || permissions.length === 0) {
        tbody.innerHTML = `<tr><td class="text-center" colspan="7">No hay permisoes de permiso registradas</td></tr>`;
        resultsText.textContent = `Mostrando 0 de ${allPermissions.length} resultados`;
        pagination.innerHTML = '';
        return;
    }

    for (const permiso of permissions) {
        // Determinar clase CSS para el estatus
        let statusClass = '';
        if (permiso.estado == 'Pendiente') {
            statusClass = 'yellow';
        } else if (permiso.estado == 'Aceptado') {
            statusClass = 'green';
        } else if (permiso.estado == 'Rechazado') {
            statusClass = 'red';
        }
        
        // Organizar las fechas del permiso para su inserción
        const orderedDates = permiso.fechas_solicitadas.split(', ')
            .map(fecha => `<p class="Permission-days">${fecha}</p>`)
            .join('');
        
        tbody.innerHTML +=
        `<tr>
            <td class="p-1 ps-3">
                <p class="permission-employee">${permiso.nombre}</p>
                <p class="permission-departament">${permiso.puesto}</p>
            </td>
            <td class="p-1">
                <p class="permission-entry-date">${permiso.fecha_ingreso}</p>
                <p class="permission-antique">Ant: ${permiso.antiguedad} años</p>
            </td>
            <td class="permission-type p-1">${permiso.tipo}</td>
            <td class="permission-dates text-center fst-italic p-1"> 
                ${orderedDates}
            </td>
            <td class="text-center p-2">
                <p class="permission-status ${statusClass}">${permiso.estado}</p>
            </td>
            <td class="permission-observations p-1">${permiso.observaciones}</td>
            <td class="permission-controls text-end p-2 pe-4 d-none" data-rh-only data-dir-only>
                <div class="action-buttons">
                    <button class="btn btn-edit" 
                        data-bs-target="#edit-modal" 
                        data-bs-toggle="modal"
                        permission-data='${JSON.stringify(permiso)}'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>`;
    };

    // Actualizar texto de resultados
    const total = allPermissions.length;
    if (resultsText) {
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

                renderPermissionsTable();
            });
        });
    }
    
    validateUserRole()
}