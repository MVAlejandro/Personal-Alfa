import supabase from '../../supabase/supabase-client.js'
// Servicios Supabase
import { createRequest, createVacations } from '../../services/vacations-service.js'; 
import { renderRequestsTable } from './vacations-table.js'; 
// Utilidades
import { loadOptions } from '../../utils/load-select.js';
import { textValidate, inputValidate, selectValidate } from '../../utils/form-validations.js';

// Cargar los clientes en los formularios al iniciar la página
document.addEventListener('DOMContentLoaded', async () => {
    loadOptions('staff', 'per_empleados', 'id_empleado', 'nombre', 'Seleccione...')
})

// Función para agregar orden de forma manual
export async function addRequests(event) {
    event.preventDefault()

    // Capturar el botón que disparó el evento
    const btn = event.target.closest('#btn-add');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = 'Subiendo...';
    }

    const form = document.getElementById('form-vacations');
    // Referencias para validación
    const id_empleadoIn = document.getElementById("staff");
    const fechaIn = document.getElementById("vacation-dates");
    const observacionesIn = document.getElementById("observations");
    // Referencias para errores
    const id_empleadoError = document.getElementById('error-staff');
    const fechaError = document.getElementById('error-vacation-dates');
    const observacionesError = document.getElementById('error-observations');

    // Validaciones
    selectValidate(id_empleadoIn, id_empleadoError)
    textValidate(fechaIn, fechaError)
    textValidate(observacionesIn, observacionesError)

    const campos = form.querySelectorAll('input, select')
    if (!inputValidate(campos)) {
        alert('Corrige los errores antes de guardar.')

        // Restaurar estado del botón
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = 
                `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy pe-1" viewBox="0 0 16 16">
                    <path d="M11 2H9v3h2z"/>
                    <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
                </svg>
                <p class="ps-2">Agregar</p>`;
        }
        return
    }

    const estado = "Pendiente";
    const fecha_solicitud = new Date().toISOString().split('T')[0];
    const fechas = fechaIn.value.split(', ');

    // Guardar valores
    const newRequestData = await createRequest({
        id_empleado: id_empleadoIn.value,
        fecha_solicitud,
        estado,
        observaciones: observacionesIn.value
    });

    const id_solicitud = newRequestData.id_solicitud;
    let insertedVacations = 0;

    for (const fecha of fechas) {
        try {
            await createVacations({ id_solicitud, fecha });
            insertedVacations++;
        } catch (err) {
            console.error(`Error insertando fecha ${fecha}`, err);
        }
    }   

    alert(`Solicitud de vacaciones agregado con éxito, se agregaron ${insertedVacations} días.`);
    form.reset();
    form.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
        e.classList.remove('is-valid', 'is-invalid');
    });
    
    // Restaurar estado del botón
    if (btn) {
        btn.disabled = false;
        btn.innerHTML = 
            `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy pe-1" viewBox="0 0 16 16">
                <path d="M11 2H9v3h2z"/>
                <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
            </svg>
            <p class="ps-2">Agregar</p>`;
    }

    // Recarga la tabla con los datos actualizados
    await renderRequestsTable();
}