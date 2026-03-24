// Estilos generales
import '../../css/style.css'
import '../../css/pages/staff.css'

// Estilos de componentes
import '../../css/components/navbar.css'
import '../../css/components/footer.css'

// Componentes JS
import '../components/navbar.js';
import { generateForm, restoreForm } from '../components/staff/generate-form.js';

// Servicios Supabase
import { initPage, validateUserRole } from '../utils/session-validate.js';
import { addStaff } from '../components/staff/staff-add.js';
import { editStaff } from '../components/staff/staff-edit.js';
import { staffFilter } from '../components/staff/staff-filter.js';
import { renderStaffEditForm } from '../components/staff/staff-edit.js';

let register = []

document.addEventListener('DOMContentLoaded', async () => {
    await initPage()
    register = await staffFilter();
});

// Declarar el botón de filtrado
document.addEventListener('click', async function(e) {
    if (e.target.id === 'filter-btn' || e.target.closest('#filter-btn')) {
        register = await staffFilter();
    }
});

// Declarar los botones para manipulación del formulario
document.getElementById("btn-add-staff").addEventListener("click", () => {
    generateForm()
    const container = document.getElementById('form-buttons-container');
    container.innerHTML =
        `<button id="btn-cancel-entry" class="btn btn-outline-secondary m-1">Cancelar</button>
         <button id="btn-add-entry" class="btn btn-primary m-1 d-none" data-rh-only>Añadir Empleado</button>`;
    validateUserRole()
});

document.addEventListener("click", (e) => {
    if (e.target.id === "btn-cancel-entry") {
        restoreForm();
    }
});

// Declarar el botón para mandar el formulario
document.addEventListener('click', function(e) {
    if (e.target.id === 'btn-add-entry') {
        addStaff(e);
    }
});

// Llenar formulario con información del empleado
const container = document.getElementById('staff-list');
container.addEventListener('click', async function(e) {
    const button = e.target.closest('button[staff-data]');
    if (!button) return;
    const staffData = JSON.parse(button.getAttribute('staff-data'));
    await generateForm();
    await renderStaffEditForm(staffData);
    const container = document.getElementById('form-buttons-container');
    container.innerHTML =
        `<button id="btn-cancel-entry" class="btn btn-outline-secondary m-1">Cancelar</button>
         <button id="btn-delete-entry" class="btn btn-danger m-1 d-none" data-rh-only data-bs-target="#delete-modal" data-bs-toggle="modal">Eliminar</button>
         <button id="btn-update-entry" class="btn btn-primary m-1 d-none" data-rh-only>Actualizar Empleado</button>`;
    validateUserRole()
});

// Declarar el botón de edición del empleado
document.addEventListener('click', function(e) {
    if (e.target.id === 'btn-update-entry') {
        editStaff(e);
    }
});

// Declarar el botón de exportación a Excel
document.getElementById("export-btn").addEventListener('click', async function() {
    if (!register.length) {
        Swal.fire({
            title: 'Atención',
            text: 'No hay datos para exportar.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return;
    }

    const ws = XLSX.utils.json_to_sheet(register);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, `Kardex`);
    XLSX.writeFile(wb, `reporte_empleados_${new Date().toISOString().split('T')[0]}.xlsx`);
});
