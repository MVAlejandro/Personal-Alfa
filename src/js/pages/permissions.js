// Estilos generales
import '../../css/style.css'
import '../../css/pages/permissions.css'

// Estilos de componentes
import '../../css/components/navbar.css'
import '../../css/components/footer.css'

// Componentes JS
import '../components/navbar.js';
import '../components/permissions/generate-form.js'

// Servicios Supabase
import { initPage } from '../utils/session-validate.js'; 
import { addPermission } from '../components/permissions/permissions-form.js';
import { absencesReport } from '../components/permissions/permissions-report.js';
import { permissionsFilter } from '../components/permissions/permissions-filter.js';
import { renderPermissionsEditModal } from '../components/permissions/permissions-modal.js';
import { renderPermissionsInfoModal } from '../components/permissions/vacations-modal.js';
import { vacationPDF } from '../components/permissions/pdf/vacation-pdf.js';
import { permissionPDF } from '../components/permissions/pdf/permission-pdf.js';

document.addEventListener('DOMContentLoaded', async () => {
    await initPage()
    // Generar tabla con todos los registros
    await permissionsFilter();
});

// Declarar el botón de filtrado
document.addEventListener('click', async function(e) {
    if (e.target.id === 'filter-btn' || e.target.closest('#filter-btn')) {
        await permissionsFilter();
    }
});

// Declarar el botón del formulario
document.addEventListener('click', function(e) {
    if (e.target.id === 'btn-add' || e.target.closest('#btn-add')) {
        addPermission(e);
    }
});

// Declarar los modales de edición e información
const editModal = document.getElementById('edit-modal');
const infoModal = document.getElementById('info-modal');

let currentPermissionData = null;

// Edición - Apertura
editModal.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget;
    currentPermissionData = JSON.parse(button.getAttribute('permission-data'));
    renderPermissionsEditModal(currentPermissionData);

    const btnSave = editModal.querySelector('#btn-save');
    btnSave.onclick = async () => {
        let doc = "";
        if (currentPermissionData.tipo == "Vacaciones") {
            doc = await vacationPDF(currentPermissionData);
        } else {
            doc = await permissionPDF(currentPermissionData);
        }

        window.open(doc.output('bloburl'), '_blank');
    };
});
// Edición - Cierre
editModal.addEventListener('hidden.bs.modal', () => {
    editModal.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
        e.classList.remove('is-valid', 'is-invalid');
    });

    editModal.querySelectorAll('input, select').forEach(el => {
        el.value = '';
    });
});

// Información - Apertura
infoModal.addEventListener('shown.bs.modal', () => {
    renderPermissionsInfoModal(currentPermissionData);
});
// Información - Cierre
infoModal.addEventListener('hidden.bs.modal', () => {
    infoModal.querySelectorAll('input, select').forEach(el => {
        el.value = '';
    });

    const tbody = document.querySelector('#permissions-resume-table tbody');
    tbody.innerHTML = `<td class="text-center" colspan="4">Sin registros</td>`;

    const container = document.getElementById('vacations-info-container');
    container.innerHTML = `<p class="text-center">Sin registros</p>`;
});

// Declarar el botón de exportación a Excel
document.getElementById("btn-report").addEventListener('click', async function() {
    absencesReport();
});

// Al cerrar modal formatear el texto
document.getElementById('report-modal').addEventListener('hidden.bs.modal', () => {
    const resultsText = document.getElementById('permissions-results');
    resultsText.textContent = `0 Registros generados`;
});

