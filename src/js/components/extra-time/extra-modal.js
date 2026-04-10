// Servicios Supabase
import { renderExtraTimeTable, renderPendingExtraTimeTable } from './extra-table.js';
// Utilidades
import { createExtraTime, updateExtraTime } from '../../services/extra-time-service.js';
import { textValidate, inputValidate } from '../../utils/form-validations.js';

// Función para cargar datos en el modal
export async function renderExtraTimeModal(id, staff) {
    // Insertar valores en los inputs
    document.getElementById('extra-id-staff').value = id;
    document.getElementById('extra-staff').value = staff;

    // Generar las tabla con sus registros
    await renderPendingExtraTimeTable(id);
    await renderExtraTimeTable(id);
}

// Función para agregar un nuevo registro de tiempo extra
document.getElementById('btn-add-extra').addEventListener('click', async function() {
    const form = document.getElementById('extra-time-form');
    const id_empleado = document.getElementById('extra-id-staff').value;
    // Referencias para validación
    const fechaIn = document.getElementById('extra-date');
    const tiempoIn = document.getElementById('extra-time');
    const observacionesIn = document.getElementById('extra-observations');

    const fechaError = document.getElementById('error-extra-date');
    const tiempoError = document.getElementById('error-extra-time');
    const observacionesError = document.getElementById('error-extra-observations');

    // Validaciones
    textValidate(fechaIn, fechaError)
    textValidate(tiempoIn, tiempoError)
    textValidate(observacionesIn, observacionesError)

    const campos = document.querySelectorAll('input')
    if (!inputValidate(campos)) {
        Swal.fire({
            title: 'Atención',
            text: 'Corrige los errores antes de guardar.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return
    }

    const newExtraTimeData = {
        id_empleado,
        fecha: fechaIn.value,
        tiempo: tiempoIn.value,
        observaciones: observacionesIn.value
    };

    try {
        await createExtraTime(newExtraTimeData);

        form.reset();
        form.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
            e.classList.remove('is-valid', 'is-invalid');
        });
        
        Swal.fire({
            title: 'Tiempo extra registrado correctamente.',
            icon: 'success',
            confirmButtonText: 'OK'
        });

        // Recarga la tabla con los datos actualizados
        await renderPendingExtraTimeTable(id_empleado);
    } catch (err) {
        console.error('Error al agregar el tiempo extra:', err);

        if (err.code === '23505' || err.code === 23505) {
            // Si el registro está duplicado avisar
            Swal.fire({
                title: 'Atención',
                text: 'No se permite más de un registro por fecha',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }
        
        Swal.fire({
            title: 'Oops...',
            text: 'Ocurrió un error al registrar el tiempo extra.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});

// Funciones de actualización para los botones de horas pendientes
const tbody = document.querySelector('#extraP-table tbody');

tbody.addEventListener('click', async (e) => {
    const button = e.target.closest('.btn-edit');

    if (!button) return;

    const extraId = button.getAttribute('extra-id');
    const staffId = button.getAttribute('staff-id');

    await updateExtraTime(extraId, {estado: "Aceptado"});

    // Mostrar alerta
    Swal.fire({
        title: 'Horas extra aprobadas.',
        icon: 'success',
        confirmButtonText: 'OK'
    });

    // Recarga el modal con los datos actualizados
    await renderPendingExtraTimeTable(staffId);
    await renderExtraTimeTable(staffId);
});

tbody.addEventListener('click', async (e) => {
    const button = e.target.closest('.btn-delete');

    if (!button) return;

    const extraId = button.getAttribute('extra-id');
    const staffId = button.getAttribute('staff-id');

    await updateExtraTime(extraId, {estado: "Rechazado"});

    // Mostrar alerta
    Swal.fire({
        title: 'Horas extra denegadas.',
        icon: 'warning',
        confirmButtonText: 'OK'
    });

    // Recarga el modal con los datos actualizados
    await renderPendingExtraTimeTable(staffId);
    await renderExtraTimeTable(staffId);
});