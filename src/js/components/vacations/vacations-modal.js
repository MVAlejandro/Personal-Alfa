// Servicios Supabase
import { updateRequest, deleteRequest } from '../../services/vacations-service.js'; 
import { renderRequestsTable } from './vacations-table.js'; 
// Utilidades
import { textValidate, inputValidate, selectValidate } from '../../utils/form-validations.js';

// Función para cargar datos en el modal
export async function renderRequestsEditModal(solicitud) {
    // Insertar valores en los inputs
    document.getElementById('edit-id-vacation').value = solicitud.id_solicitud;
    document.getElementById('edit-staff').value = solicitud.nombre;
    document.getElementById('edit-entry').value = solicitud.fecha_ingreso;
    document.getElementById('edit-antique').value = `${solicitud.antiguedad} años`
    document.getElementById('edit-status').value = solicitud.estado;
    document.getElementById('edit-observations').value = solicitud.observaciones;

    // Limpiar filas anteriores
    const container = document.getElementById("vacations-dates-container");
    container.innerHTML = '';

    // Obtener las fechs de la solicitud
    const fechas = solicitud.vacaciones

    // Agregar una fila por cada producto
    for (const fecha of fechas) {
        await addDateRow(fecha);
    }
}

// Función para agregar campos de productos
async function addDateRow(dateValue = '') {
    const container = document.getElementById("vacations-dates-container");
    const newDate = document.createElement("div");
    newDate.className = "ms-2 me-2 pb-1 date-item";
    newDate.innerHTML = 
        `<li class="date-input">${dateValue}</li>`;
    container.appendChild(newDate);
}

// Función para guardar cambios
document.getElementById('btn-edit-entry').addEventListener('click', async function() {
    const form = document.getElementById('vacations-edit-form');
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
        alert('Corrige los errores antes de guardar.')
        return
    }

    const id_solicitud = document.getElementById('edit-id-vacation').value;
    const updatedData = {
        estado: statusIn.value,
        observaciones: observacionesIn.value
    };

    try {
        await updateRequest(id_solicitud, updatedData);

        form.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
            e.classList.remove('is-valid', 'is-invalid');
        });
        
        // Cerrar el modal y mostrar alerta
        bootstrap.Modal.getInstance(document.getElementById('edit-modal')).hide();
        alert('Solicitud de vacaciones actualizada correctamente.');

        // Recarga la tabla con los datos actualizados
        await renderRequestsTable();
    } catch (err) {
        console.error('Error al actualizar la solicitud:', err);
        alert('Ocurrió un error al actualizar la solicitud de vacaciones.');
    }
});

// Eliminar entrada al dar click en el botón del modal
document.getElementById('btn-delete-entry').addEventListener('click', async () => {
    const idRequest = document.getElementById('delete-id-vacation').value;
    await deleteRequest(idRequest);

    // Cerrar el modal y mostrar alerta
    bootstrap.Modal.getInstance(document.getElementById('delete-modal')).hide();
    alert('Solicitud de vacaciones eliminada correctamente.');

    // Recarga la tabla con los datos actualizados
    await renderRequestsTable();
});