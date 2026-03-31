// Servicios Supabase
import { updateSchedule, createSchedule } from '../../services/schedule-service.js'; 
import { renderSchedulesTable } from './schedule-table.js';
// Utilidades
import { timeValidate } from '../../utils/form-validations.js';

// Función para cargar datos en el modal
export async function renderScheduleEditModal(horario) {
    // Insertar valores en los inputs
    document.getElementById('edit-id-staff').value = horario.id_empleado;
    document.getElementById('edit-staff').value = horario.nombre;
    document.getElementById('edit-id').value = horario.numero_empleado;

    // Limpiar filas anteriores
    const container = document.getElementById("schedule-days-container");
    container.innerHTML = '';

    // Agregar una fila por cada día
    for (const dia of horario.dias) {
        await addDayRow(dia);
    }
}

// Función para agregar una fecha visualmente en la lista
async function addDayRow(dayValue = '') {
    const container = document.getElementById("schedule-days-container");
    const newDay = document.createElement("div");
    newDay.className = "schedule-day-item row mb-1 mx-0 px-0";
    newDay.innerHTML = 
        `<div class="col-12 col-lg-2 label-over-border date-item">
            <input type="hidden" class="id-schedule" value="${dayValue.id_horario}">
            <p class="day fw-bold ps-2 pb-3">${dayValue.dia}</p>
        </div>
        <div class="col-6 col-lg-5 label-over-border date-item mb-4">
            <label for="edit-entry-${dayValue.id_horario}" class="form-label m-2">Entrada</label>
            <input type="time" class="form-control entry-time" id="edit-entry-${dayValue.id_horario}" value="${dayValue.entrada || "08:00"}">
            <p class="entry-error invalid-feedback" id="error-entry-${dayValue.id_horario}" style="color: red;"></p>
        </div>
        <div class="col-6 col-lg-5 label-over-border date-item mb-4">
            <label for="edit-exit-${dayValue.id_horario}" class="form-label m-2">Salida</label>
            <input type="time" class="form-control exit-time" id="edit-exit-${dayValue.id_horario}" value="${dayValue.salida || "17:30"}">
            <p class="exit-error invalid-feedback" id="error-exit-${dayValue.id_horario}" style="color: red;"></p>
        </div>`;
    container.appendChild(newDay);
}

// Función para guardar cambios
document.getElementById('btn-edit-entry').addEventListener('click', async function() {
    // Capturar el botón que disparó el evento
    const btn = document.getElementById('btn-edit-entry');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = 'Subiendo...';
    }
    
    const id_empleado = document.getElementById('edit-id-staff').value;
    const form = document.getElementById('schedule-edit-form');
    const scheduleItems = document.querySelectorAll('.schedule-day-item');

    let isValid = true;
    const scheduleData = [];

    for (const item of scheduleItems) {
        const id_horario = item.querySelector('.id-schedule');
        const dia = item.querySelector('.day');
        const entrada = item.querySelector('.entry-time');
        const entradaError = item.querySelector('.entry-error'); 
        const salida = item.querySelector('.exit-time');
        const salidaError = item.querySelector('.exit-error'); 

        const entradaOk = timeValidate(entrada, entradaError);
        const salidaOk = timeValidate(salida, salidaError);

        // Si algo falla, marcar como inválido
        if (!entradaOk || !salidaOk) {
            isValid = false;
        }

        // Guardar los datos para su procesamiento
        scheduleData.push({
            id_horario: id_horario.value,
            dia: dia.textContent,
            entrada: entrada.value,
            salida: salida.value
        });
    }

    // Validación final
    if (!isValid) {
        Swal.fire({
            title: 'Atención',
            text: 'Corrige los errores antes de guardar.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        // Restaurar estado del botón
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = 
                `<p>Guardar cambios</p>`;
        }
        return;
    }

    // Si todo es válido, crear o actualizar el horario
    try {
        for (const horario of scheduleData) {
            if (horario.id_horario == "null" || horario.id_horario == null) {
                console.log("crear");
                await createSchedule({id_empleado, dia: horario.dia, entrada: horario.entrada, salida: horario.salida})
            } else {
                console.log("actualizar");
                await updateSchedule(horario.id_horario, {id_empleado, dia: horario.dia, entrada: horario.entrada, salida: horario.salida})
            }
        }
    
        // Cerrar el modal y mostrar alerta
        bootstrap.Modal.getInstance(document.getElementById('edit-modal')).hide();
        Swal.fire({
            title: 'Horario actualizado correctamente.',
            icon: 'success',
            confirmButtonText: 'OK'
        });
            
    
        form.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
            e.classList.remove('is-valid', 'is-invalid');
        });
    
        // Recarga la tabla con los datos actualizados
        renderSchedulesTable();
    } catch (err) {
        console.error('Error al actualizar el horario:', err);
        Swal.fire({
            title: 'Oops...',
            text: 'Ocurrió un error al actualizar el horario.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    } finally {
        // Restaurar estado del botón
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = 
                `<p>Guardar cambios</p>`;
        }
    }
});
