// Servicios Supabase
import { findStaff, updateStaff } from '../../services/staff-service.js';
import { renderStaffList } from './staff-list.js';
import { validateUserRole } from '../../utils/session-validate.js';
// Utilidades
import { validateForm } from './staff-form.js';

// Función para cargar datos en el formulario
export async function renderStaffEditForm(staff) {
    document.getElementById("hidden-id-staff").value = staff.id_empleado;
    document.getElementById("id-staff").value = staff.numero_empleado;
    document.getElementById("staff-name").value = staff.nombre;
    document.getElementById("staff-departament").value = staff.id_departamento;
    document.getElementById("staff-position").value = staff.puesto;
    document.getElementById("staff-status").value = staff.estatus;
    document.getElementById("staff-entry").value = staff.fecha_ingreso;
    document.getElementById("staff-removed").value = staff.fecha_baja || "";
    document.getElementById("staff-birth").value = staff.fecha_nacimiento;
    document.getElementById("staff-nss").value = staff.nss;
    document.getElementById("staff-rfc").value = staff.rfc;
    document.getElementById("staff-curp").value = staff.curp;
    document.getElementById("staff-phone").value = staff.telefono;
    document.getElementById("staff-direction").value = staff.direccion;
    document.getElementById("emergency-name").value = staff.nombre_emergencia;
    document.getElementById("emergency-relation").value = staff.parentesco_emergencia;
    document.getElementById("emergency-phone").value = staff.telefono_emergencia;
    document.getElementById("staff-btype").value = staff.tipo_sangre;
    document.getElementById("staff-illness").value = staff.enfermedad;
    document.getElementById("staff-medicament").value = staff.medicamento;
    document.getElementById("staff-allergy").value = staff.alergia;
    document.getElementById("staff-boots").value = staff.calzado;
    document.getElementById("staff-tshirt").value = staff.playera;
    document.getElementById("staff-shirt").value = staff.camisa;
    document.getElementById("staff-pants").value = staff.pantalon;

    if(document.getElementById("staff-status").value == "Activo") {
        document.getElementById("id-staff").disabled = false;
    }

    const container = document.getElementById('form-buttons-container');

    // A partir del estatus del empleado generar los botones correspondientes
    if(document.getElementById("staff-status").value == "Pendiente") {
        container.innerHTML =
            `<button id="btn-cancel-entry" class="btn btn-outline-secondary m-1">Cerrar</button>
            <button id="btn-authorize-entry" class="btn btn-primary m-1 d-none" data-rh-only>Autorizar Alta</button>`;
        validateUserRole()
    } else if(document.getElementById("staff-status").value == "Activo") {
        container.innerHTML =
            `<button id="btn-cancel-entry" class="btn btn-outline-secondary m-1">Cerrar</button>
            <button id="btn-remove-entry" class="btn btn-danger m-1 d-none" data-rh-only data-bs-target="#remove-modal" data-bs-toggle="modal">Solicitar Baja</button>
            <button id="btn-update-entry" class="btn btn-primary m-1 d-none" data-rh-only>Actualizar Empleado</button>`;
        validateUserRole()
    } else {
        container.innerHTML =
            `<button id="btn-cancel-entry" class="btn btn-outline-secondary m-1">Cerrar</button>`;
        validateUserRole()
    }
}

export async function editStaff(event) {
    event.preventDefault()

    // Capturar el botón que disparó el evento
    const btn = event.target.closest('#btn-update-entry');
    const id_staff = document.getElementById('hidden-id-staff').value;

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = 'Actualizando...';
    }

    const staffData = validateForm();

    if (!staffData) {
        Swal.fire({
            title: 'Atención',
            text: 'Corrige los errores antes de guardar.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        btn.disabled = false;
        btn.innerHTML = `<p>Actualizar Empleado</p>`;
        return;
    }

    try {
        await updateStaff(id_staff, staffData);

        const form = document.getElementById('staff-form');
        form.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
            e.classList.remove('is-valid', 'is-invalid');
        });
        
        // Mostrar alerta
        Swal.fire({
            title: 'Empleado actualizado correctamente.',
            icon: 'success',
            confirmButtonText: 'OK'
        });

        // Bajar la información del empleado encontrado con su id
        const updatedStaffData = await findStaff(id_staff)

        // Recarga el contenedor con los datos actualizados
        await renderStaffEditForm(updatedStaffData);
        // Recarga la lista con los datos actualizados
        await renderStaffList();
    } catch (err) {
        console.error('Error al actualizar empleado:', err);
        Swal.fire({
            title: 'Oops...',
            text: 'Ocurrió un error al actualizar al empleado.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    } finally {
        // Restaurar estado del botón
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<p>Actualizar Empleado</p>`;
        }
    }
}

export async function authorizeStaff(event) {
    event.preventDefault()

    const id_staff = document.getElementById('hidden-id-staff').value;

    try {
        await updateStaff(id_staff, {estatus: "Activo"});
        
        // Mostrar alerta
        Swal.fire({
            title: 'Empleado dado de alta correctamente.',
            icon: 'success',
            confirmButtonText: 'OK'
        });

        // Bajar la información del empleado encontrado con su id
        const updatedStaffData = await findStaff(id_staff)

        // Recarga el contenedor con los datos actualizados
        await renderStaffEditForm(updatedStaffData);
        // Recarga la lista con los datos actualizados
        await renderStaffList();
    } catch (err) {
        console.error('Error al dar de alta al empleado:', err);
        Swal.fire({
            title: 'Oops...',
            text: 'Ocurrió un error al dar de alta al empleado.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}