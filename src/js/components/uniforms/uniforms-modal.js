// Servicios Supabase
import { updateUniforms, deleteUniforms } from '../../services/uniforms-service.js'; 
import { renderUniformsTable } from './uniforms-table.js'; 
// Utilidades
import { textValidate, amountValidate, inputValidate } from '../../utils/form-validations.js';

// Función para cargar datos en el modal
export async function renderUniformsEditModal(uniforme) {
    // Insertar valores en los inputs
    document.getElementById('edit-id-uniform').value = uniforme.id_uniforme;
    document.getElementById('edit-date').value = uniforme.fecha_entrega;
    document.getElementById('edit-type').value = uniforme.tipo_prenda;
    document.getElementById('edit-size').value = uniforme.talla;
    document.getElementById('edit-quantity').value = uniforme.cantidad;
    document.getElementById('edit-staff').value = uniforme.nombre;
    document.getElementById('edit-observations').value = uniforme.observaciones;
}

// Función para guardar cambios
document.getElementById('btn-edit-entry').addEventListener('click', async function() {
    const form = document.getElementById('uniforms-edit-form');
    // Referencias para validación
    const tallaIn = document.getElementById('edit-size');
    const cantidadIn = document.getElementById('edit-quantity');
    const observacionesIn = document.getElementById('edit-observations');

    const tallaError = document.getElementById('error-editSize');
    const cantidadError = document.getElementById('error-editQuantity');
    const observacionesError = document.getElementById('error-editObservations');

    // Validaciones
    textValidate(tallaIn, tallaError)
    amountValidate(cantidadIn, cantidadError)
    textValidate(observacionesIn, observacionesError)

    const campos = document.querySelectorAll('input')
    if (!inputValidate(campos)) {
        alert('Corrige los errores antes de guardar.')
        return
    }

    const id_uniforme = document.getElementById('edit-id-uniform').value;
    const updatedData = {
        talla: tallaIn.value,
        cantidad: cantidadIn.value,
        observaciones: observacionesIn.value
    };

    try {
        await updateUniforms(id_uniforme, updatedData);

        form.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
            e.classList.remove('is-valid', 'is-invalid');
        });
        
        // Cerrar el modal y mostrar alerta
        bootstrap.Modal.getInstance(document.getElementById('edit-modal')).hide();
        alert('Entrega de uniforme actualizada correctamente.');

        // Recarga la tabla con los datos actualizados
        await renderUniformsTable();
    } catch (err) {
        console.error('Error al actualizar la entrega de uniforme:', err);
        alert('Ocurrió un error al actualizar la entrega de uniforme.');
    }
});

// Eliminar entrada al dar click en el botón del modal
document.getElementById('btn-delete-entry').addEventListener('click', async () => {
    const idUniform = document.getElementById('delete-id-uniform').value;
    await deleteUniforms(idUniform);

    // Cerrar el modal y mostrar alerta
    bootstrap.Modal.getInstance(document.getElementById('delete-modal')).hide();
    alert('Entrega de uniforme eliminada correctamente.');

    // Recarga la tabla con los datos actualizados
    await renderUniformsTable();
});