// Servicios Supabase
import { updateUniformsDeliver, deleteUniformsDeliver } from '../../services/uniforms-deliver-service.js'; 
import { renderUniformsDeliverTable } from './uniforms-table.js'; 
// Utilidades
import { textValidate, inputValidate } from '../../utils/form-validations.js';

// Función para cargar datos en el modal
export async function renderUniformsEditModal(entrega) {
    // Insertar valores en los inputs
    document.getElementById('edit-id-deliver').value = entrega.id_entrega;
    document.getElementById('edit-date').value = entrega.fecha_entrega;
    document.getElementById('edit-type').value = entrega.tipo_entrega;
    document.getElementById('edit-cloth').value = entrega.tipo_prenda;
    document.getElementById('edit-size').value = entrega.talla;
    document.getElementById('edit-quantity').value = entrega.cantidad;
    document.getElementById('edit-staff').value = entrega.nombre;
    document.getElementById('edit-observations').value = entrega.observaciones;
}

// Función para guardar cambios
document.getElementById('btn-edit-entry').addEventListener('click', async function() {
    const form = document.getElementById('delivers-edit-form');
    // Referencias para validación
    const observacionesIn = document.getElementById('edit-observations');
    const observacionesError = document.getElementById('error-editObservations');

    // Validaciones
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

    const id_entrega = document.getElementById('edit-id-deliver').value;
    const updatedData = { observaciones: observacionesIn.value };

    try {
        await updateUniformsDeliver(id_entrega, updatedData);

        form.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
            e.classList.remove('is-valid', 'is-invalid');
        });
        
        // Cerrar el modal y mostrar alerta
        bootstrap.Modal.getInstance(document.getElementById('edit-modal')).hide();
        Swal.fire({
            title: 'Entrega de uniforme actualizada correctamente.',
            icon: 'success',
            confirmButtonText: 'OK'
        });

        // Recarga la tabla con los datos actualizados
        await renderUniformsDeliverTable();
    } catch (err) {
        console.error('Error al actualizar la entrega de uniforme:', err);
        Swal.fire({
            title: 'Oops...',
            text: 'Ocurrió un error al actualizar la entrega de uniforme..',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});

// Eliminar entrada al dar click en el botón del modal
document.getElementById('btn-delete-entry').addEventListener('click', async () => {
    const idUniform = document.getElementById('delete-id-uniform').value;
    await deleteUniformsDeliver(idUniform);

    // Cerrar el modal y mostrar alerta
    bootstrap.Modal.getInstance(document.getElementById('delete-modal')).hide();
    Swal.fire({
        title: 'Entrega de uniforme eliminada correctamente.',
        icon: 'warning',
        confirmButtonText: 'OK'
    });

    // Recarga la tabla con los datos actualizados
    await renderUniformsDeliverTable();
});