// Servicios Supabase
import { createRemove } from '../../services/staff-removed-service.js';
import { findStaff, updateStaff } from '../../services/staff-service.js';
import { renderStaffEditForm } from './staff-edit.js';
import { staffFilter } from './staff-filter.js';
// Utilidades
import { inputValidate, selectValidate, textValidate } from '../../utils/form-validations.js';


export async function removeStaff(event) {
    event.preventDefault()

    // Capturar el botón que disparó el evento
    const btn = event.target.closest('#btn-remove-staff');
    const id_staff = document.getElementById('hidden-id-staff').value;
    const form = document.getElementById('remove-staff-form');
    // Referencias para validación
    const motivoIn = document.getElementById("remove-motive");
    const descripcionIn = document.getElementById("remove-description");
    const recontratacionIn = document.getElementById("remove-rehiring");
    const razonIn = document.getElementById("remove-reason");
    // Referencias para errores
    const motivoError = document.getElementById("error-remove-motive");
    const descripcionError = document.getElementById("error-remove-description");
    const recontratacionError = document.getElementById("error-remove-rehiring");
    const razonError = document.getElementById("error-remove-reason");

    // Validaciones
    selectValidate(motivoIn, motivoError)
    textValidate(descripcionIn, descripcionError)
    selectValidate(recontratacionIn, recontratacionError)
    textValidate(razonIn, razonError)

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
            btn.innerHTML = `<p>Dar de Baja</p>`;
        }
        return
    }

    // Guardar valores
    const newRemoveData = {
        id_empleado: id_staff,
        motivo: motivoIn.value,
        fecha_baja: new Date().toISOString().split('T')[0],
        descripcion: descripcionIn.value,
        recontratacion: recontratacionIn.value,
        razon: razonIn.value
    };

    try {
        await createRemove(newRemoveData);
        await updateStaff(id_staff, {estatus: "Inactivo", fecha_baja: new Date().toISOString().split('T')[0],});

        form.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
            e.classList.remove('is-valid', 'is-invalid');
        });
        
        // Cerrar el modal y mostrar alerta
        bootstrap.Modal.getInstance(document.getElementById('remove-modal')).hide();
        Swal.fire({
            title: 'Empleado dado de baja correctamente.',
            icon: 'success',
            confirmButtonText: 'OK'
        });

        // Bajar la información del empleado encontrado con su id
        const updatedStaffData = await findStaff(id_staff)

        // Recarga el contenedor con los datos actualizados
        await renderStaffEditForm(updatedStaffData);
        // Recarga la lista con los datos actualizados
        await staffFilter();
    } catch (err) {
        console.error('Error al dar de baja al empleado:', err);
        Swal.fire({
            title: 'Oops...',
            text: 'Ocurrió un error al dar de baja al empleado.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    } finally {
        // Restaurar estado del botón
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<p>Dar de Baja</p>`;
        }
    }
}