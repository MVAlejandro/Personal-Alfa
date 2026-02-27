// Servicios Supabase
import { updateStaff, deleteStaff } from '../../services/staff-service.js'; 
import { renderStaffList } from './staff-list.js'; 
import { restoreForm } from './generate-form.js';
// Utilidades
import { validateForm } from './staff-form.js';

// Función para cargar datos en el formulario
export async function renderStaffEditForm(staff) {
    // Insertar valores en los inputs
    document.getElementById("hidden-id-staff").value = staff.id_empleado;
    document.getElementById("id-staff").value = staff.numero_empleado;
    document.getElementById("staff-name").value = staff.nombre;
    document.getElementById("staff-departament").value = staff.puesto;
    document.getElementById("staff-birth").value = staff.fecha_nacimiento;
    document.getElementById("staff-phone").value = staff.telefono;
    document.getElementById("staff-entry").value = staff.fecha_ingreso;
    document.getElementById("staff-nss").value = staff.nss;
    document.getElementById("staff-rfc").value = staff.rfc;
    document.getElementById("staff-curp").value = staff.curp;
    document.getElementById("staff-direction").value = staff.direccion;
    document.getElementById("staff-status").value = staff.estatus;
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
        alert('Corrige los errores antes de guardar.');
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
        alert('Empleado actualizado correctamente.');

        // Recarga el contenedor con los datos actualizados
        await renderStaffEditForm(staffData);
    } catch (err) {
        console.error('Error al actualizar empleado:', err);
        alert('Ocurrió un error al actualizar al empleado.');
    }
}

// Eliminar entrada al dar click en el botón
document.getElementById('btn-delete-entry').addEventListener('click', async () => {
    const idStaff = document.getElementById('hidden-id-staff').value;
    console.log("ID: "+idStaff);
    
    await deleteStaff(idStaff);

    // Mostrar alerta
    alert('Empleado eliminado correctamente.');

    // Recarga la página con los datos actualizados
    await renderStaffList();
    await restoreForm();
});
