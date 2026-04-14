// Servicios Supabase
import { getPermission } from '../../services/permissions-service.js';
import { getVacationsResume } from '../../services/vacations-service.js';

// Función para cargar datos en el modal de información
export async function renderPermissionsInfoModal(permiso) {
    const today = new Date().toISOString().split("T")[0]
    const allPermissions = await getPermission(permiso.id_empleado)
    const allVacations = await getVacationsResume(today);
    const vacations = allVacations.find(v => v.id_empleado === permiso.id_empleado);
    // Insertar valores en los inputs
    document.getElementById('info-id-staff').value = permiso.id_empleado;
    document.getElementById('info-id').value = permiso.numero_empleado;
    document.getElementById('info-staff').value = permiso.nombre;

    // Limpiar registros anteriores
    const tbody = document.querySelector('#permissions-resume-table tbody');
    tbody.innerHTML = '';
    const container = document.getElementById('vacations-info-container');
    container.innerHTML = '';

    if (!allPermissions || allPermissions.length === 0) {
        tbody.innerHTML = `<tr><td class="text-center" colspan="4">Sin registros</td></tr>`;
        return;
    }

    for (const permiso of allPermissions) {
        // Determinar clase CSS para el estatus
        let statusClass = '';
        if (permiso.estado == 'Pendiente') {
            statusClass = 'yellow';
        } else if (permiso.estado == 'Aceptado') {
            statusClass = 'green';
        } else if (permiso.estado == 'Rechazado') {
            statusClass = 'red';
        }
        
        tbody.innerHTML +=
        `<tr>
            <td class="permission-date p-1">${permiso.fecha_solicitud}</td>
            <td class="permission-type p-1">${permiso.tipo}</td>
            <td class="permission-dates fst-italic p-1">${permiso.fechas_solicitadas}</td>
            <td class="text-center p-2">
                <p class="permission-status ${statusClass}">${permiso.estado}</p>
            </td>
        </tr>`;
    };

    if (!vacations || vacations === "") {
        container.innerHTML = `<p class="text-center">Sin registros</p>`;
        return;
    }

    container.innerHTML = 
    `<div class="row ms-2 me-2 mt-1">
        <div class="col-lg-6 mt-2">
            <p class="ps-1"p><span class="text-sencondary fw-semibold">Fecha de Ingreso:</span> ${vacations.fecha_ingreso}</p>
        </div>
        <div class="col-lg-6 mt-2">
            <p class="ps-1"p><span class="text-sencondary fw-semibold">Antigüedad:</span> ${vacations.antiguedad}</p>
        </div>
    </div>
    <div class="row ms-2 me-2">
        <div class="col-lg-6 mt-2">
            <p class="ps-1"p><span class="text-sencondary fw-semibold">Total días:</span> ${vacations.dias_asignados}</p>
        </div>
        <div class="col-lg-6 mt-2">
            <p class="ps-1"p><span class="text-sencondary fw-semibold">Días tomados:</span> ${vacations.dias_tomados}</p>
        </div>
    </div>
    <div class="row ms-2 me-2">
        <div class="col-lg-6 mt-2">
            <p class="ps-1"p><span class="text-sencondary fw-semibold">Días pendientes:</span> ${vacations.saldo}</p>
        </div>
        <div class="col-lg-6 mt-2">
            <p class="ps-1"p><span class="text-sencondary fw-semibold">Fechas:</span> ${vacations.fechas_tomadas}</p>
        </div>
    </div>`;
}