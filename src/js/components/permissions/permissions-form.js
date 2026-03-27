// Servicios Supabase
import { createPermission } from '../../services/permissions-service.js';
import { renderPermissionsTable } from './permissions-table.js'; 
// Utilidades
import { textValidate, inputValidate, selectValidate } from '../../utils/form-validations.js';

// Función para agregar una nueva solicitud
export async function addPermission(event) {
    event.preventDefault()

    // Capturar el botón que disparó el evento
    const btn = event.target.closest('#btn-add');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = 'Subiendo...';
    }

    const form = document.getElementById('form-permissions');
    // Referencias para validación
    const id_empleadoIn = document.getElementById("staff");
    const tipoIn = document.getElementById("type");
    const fechaIn = document.getElementById("permission-dates");
    const observacionesIn = document.getElementById("observations");
    // Referencias para errores
    const id_empleadoError = document.getElementById('error-staff');
    const tipoError = document.getElementById("error-type");
    const fechaError = document.getElementById('error-permission-dates');
    const observacionesError = document.getElementById('error-observations');

    // Validaciones
    selectValidate(id_empleadoIn, id_empleadoError)
    selectValidate(tipoIn, tipoError)
    textValidate(fechaIn, fechaError)
    textValidate(observacionesIn, observacionesError)

    const campos = form.querySelectorAll('input, select')
    if (!inputValidate(campos)) {
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

    // Guardar valores
    const newPermissionData = {
        id_empleado: id_empleadoIn.value,
        tipo: tipoIn.value,
        fecha_solicitud,
        fechas_solicitadas: fechaIn.value,
        estado,
        observaciones: observacionesIn.value
    };

    try {
        await createPermission(newPermissionData);
        Swal.fire({
            title: 'Solicitud de permiso generada con éxito',
            icon: 'success',
            confirmButtonText: 'OK'
        });
        form.reset();
        form.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
            e.classList.remove('is-valid', 'is-invalid');
        });
    
        // Recarga la tabla con los datos actualizados
       await renderPermissionsTable();
    } catch (err) {
        console.error('Error al generar solicitud:', err);
        Swal.fire({
            title: 'Oops...',
            text: 'Ocurrió un error al solicitar el permiso.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    } finally {
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
    }
}