// Servicios Supabase
import { createStaff } from '../../services/staff-service.js';
import { renderStaffList } from './staff-list.js';
// Utilidades
import { validateForm } from './staff-form.js';

// Función para agregar un nuevo empleado
export async function addStaff(event) {
    event.preventDefault()

    // Capturar el botón que disparó el evento
    const btn = event.target.closest('#btn-add-entry');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = 'Subiendo...';
    }

    const staffData = validateForm();

    if (!staffData) {
        alert('Corrige los errores antes de guardar.');
        btn.disabled = false;
        btn.innerHTML = `<p>Añadir Empleado</p>`;
        return;
    }

    try {
        await createStaff(staffData);
        alert('Empleado agregado con éxito.');
        const form = document.getElementById('staff-form');
        form.reset();
        form.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
            e.classList.remove('is-valid', 'is-invalid');
        });
        
        // Recarga la lista con los datos actualizados
        await renderStaffList();
    } catch (err) {
        console.error('Error al agregar al empleado:', err);
        alert('Ocurrió un error al agregar al empleado.');
    } finally {
        // Restaurar estado del botón
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = 
                `<p>Añadir Empleado</p>`;
        }
    }
}