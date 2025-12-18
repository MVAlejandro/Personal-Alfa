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
import { addStaff } from '../components/staff/staff-form.js';
import { renderStaffList } from '../components/staff/staff-list.js';
import { renderStaffEditForm } from '../components/staff/staff-edition.js';

document.addEventListener('DOMContentLoaded', async () => {
    // await initPage()
    renderStaffList();
});

// Declarar los botones para manipulación del formulario
document.getElementById("btn-add-staff").addEventListener("click", generateForm);
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
});
