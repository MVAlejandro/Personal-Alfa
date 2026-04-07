// Servicios Supabase
import { getPermission, updatePermission } from '../../services/permissions-service.js'; 
import { createAbsence, getVacationsResume } from '../../services/absences-service.js';
import { renderPermissionsTable } from './permissions-table.js'; 
// Utilidades
import { textValidate, inputValidate, selectValidate } from '../../utils/form-validations.js';

// Función para cargar datos en el modal de edición
export async function renderPermissionsEditModal(permiso) {
    // Insertar valores en los inputs
    document.getElementById('edit-id-permission').value = permiso.id_permiso;
    document.getElementById('edit-id-staff').value = permiso.id_empleado;
    document.getElementById('edit-requested-dates').value = permiso.fechas_solicitadas;
    document.getElementById('edit-date').value = permiso.fecha_solicitud;
    document.getElementById('edit-staff').value = permiso.nombre;
    document.getElementById('edit-antique').value = `${permiso.antiguedad} años`;
    document.getElementById('edit-type').value = permiso.tipo;
    document.getElementById('edit-status').value = permiso.estado;
    document.getElementById('edit-observations').value = permiso.observaciones;

    // Bloquear actualización de estado si no está pendiente la permiso
    if (permiso.estado !== "Pendiente") {
        document.getElementById('edit-status').disabled = true;
        document.getElementById('btn-edit-entry').disabled = true;
    } else {
        document.getElementById('edit-status').disabled = false;
        document.getElementById('btn-edit-entry').disabled = false;
    }

    // Limpiar filas anteriores
    const container = document.getElementById("permissions-dates-container");
    container.innerHTML = '';

    // Obtener las fechs del permiso
    const fechas = permiso.fechas_solicitadas.split(', ');

    // Agregar una fila por cada fecha
    for (const fecha of fechas) {
        await addDateRow(fecha);
    }
}

// Función para agregar una fecha visualmente en la lista
async function addDateRow(dateValue = '') {
    const container = document.getElementById("permissions-dates-container");
    const newDate = document.createElement("div");
    newDate.className = "ms-2 me-2 pb-1 date-item";
    newDate.innerHTML = 
        `<li class="date-input ms-2">${dateValue}</li>`;
    container.appendChild(newDate);
}

// Función para guardar cambios
document.getElementById('btn-edit-entry').addEventListener('click', async function() {
    const id_permiso = document.getElementById('edit-id-permission').value;
    const id_empleado = document.getElementById('edit-id-staff').value;
    const dates = document.getElementById('edit-requested-dates').value;
    const tipo = document.getElementById('edit-type').value;
    const form = document.getElementById('permissions-edit-form');
    // Referencias para validación
    const statusIn = document.getElementById('edit-status');
    const observacionesIn = document.getElementById('edit-observations');

    const statusError = document.getElementById('error-editStatus');
    const observacionesError = document.getElementById('error-editObservations');

    // Validaciones
    selectValidate(statusIn, statusError)
    textValidate(observacionesIn, observacionesError)

    const campos = document.querySelectorAll('input, select')
    if (!inputValidate(campos)) {
        Swal.fire({
            title: 'Atención',
            text: 'Corrige los errores antes de guardar.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return
    }

    const updatedData = {
        estado: statusIn.value,
        observaciones: observacionesIn.value
    };

    try {
        await updatePermission(id_permiso, updatedData);

        // Si se aprueba el permiso, generar ausencia
        if (statusIn.value === "Aceptado") {
            const fechas = dates.split(', ');
            let insertedAbsences = 0;

            for (const fecha of fechas) {
                try {
                    await createAbsence({ id_permiso, id_empleado, fecha, tipo });
                    insertedAbsences++;
                } catch (err) {
                    console.error(`Error insertando fecha ${fecha}`, err);
                }
            }

            // Cerrar el modal y mostrar alerta
            bootstrap.Modal.getInstance(document.getElementById('edit-modal')).hide();
            Swal.fire({
                title: 'Permiso de ausencia aprobado correctamente.',
                text: `Se agregaron ${insertedAbsences} días.`,
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } else {
            // Cerrar el modal y mostrar alerta
            bootstrap.Modal.getInstance(document.getElementById('edit-modal')).hide();
            Swal.fire({
                title: 'Permiso de ausencia actualizado correctamente.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } 

        form.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
            e.classList.remove('is-valid', 'is-invalid');
        });

        // Recarga la tabla con los datos actualizados
        await renderPermissionsTable();
    } catch (err) {
        console.error('Error al actualizar el permiso:', err);
        Swal.fire({
            title: 'Oops...',
            text: 'Ocurrió un error al actualizar el permiso de ausencia.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});

// Función para cargar datos en el modal de información
export async function renderPermissionsInfoModal(permiso) {
    const allPermissions = await getPermission(permiso.id_empleado)
    const allVacations = await getVacationsResume();
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
            <p class="ps-1"p><span class="text-sencondary fw-semibold">Total días:</span> ${vacations.dias_total}</p>
        </div>
        <div class="col-lg-6 mt-2">
            <p class="ps-1"p><span class="text-sencondary fw-semibold">Días tomados:</span> ${vacations.dias_tomados}</p>
        </div>
    </div>
    <div class="row ms-2 me-2">
        <div class="col-lg-6 mt-2">
            <p class="ps-1"p><span class="text-sencondary fw-semibold">Días pendientes:</span> ${vacations.dias_pendientes}</p>
        </div>
        <div class="col-lg-6 mt-2">
            <p class="ps-1"p><span class="text-sencondary fw-semibold">Fechas:</span> ${vacations.fechas_tomadas}</p>
        </div>
    </div>`;
}