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
import { generatePDF } from '../components/permissions/permissions-print.js';

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

// Acciones del modal de edición
const editModal = document.getElementById('edit-modal');
// Al abrir modal
editModal.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget;
    const permissionData = JSON.parse(button.getAttribute('permission-data'));
    renderPermissionsEditModal(permissionData);

    // Declarar el botón de guardado
    const btnSave = editModal.querySelector('#btn-save');
    // Elimina eventos anteriores para evitar duplicados
    btnSave.onclick = async function () {
        const doc = await generatePDF(permissionData);
        window.open(doc.output('bloburl'), '_blank');
    };
});
// Al cerrar modal
editModal.addEventListener('hidden.bs.modal', () => {
    editModal.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
        e.classList.remove('is-valid', 'is-invalid');
    });

    editModal.querySelectorAll('input, select').forEach(el => {
        el.value = '';
    });
});

// Acciones del modal de eliminación
const deleteModal = document.getElementById('delete-modal');
// Al abrir modal
deleteModal.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget;
    const idpermission = button.dataset.id;
    document.getElementById('delete-id-permission').value = idpermission;
});
// Al cerrar modal
deleteModal.addEventListener('hidden.bs.modal', () => {
    document.getElementById('delete-id-permission').value = '';
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

