// Estilos generales
import '../../css/style.css'
import '../../css/pages/vacations.css'

// Estilos de componentes
import '../../css/components/navbar.css'
import '../../css/components/footer.css'

// Componentes JS
import '../components/navbar.js';
import '../components/vacations/generate-form.js'

// Servicios Supabase
import { initPage } from '../utils/session-validate.js'; 
import { addRequests } from '../components/vacations/vacations-form.js';
import { requestsFilter } from '../components/vacations/vacations-filter.js';
import { renderRequestsTable } from '../components/vacations/vacations-table.js';
import { renderRequestsEditModal } from '../components/vacations/vacations-modal.js';
import { generatePDF } from '../components/vacations/vacations-print.js';

document.addEventListener('DOMContentLoaded', async () => {
    await initPage()
    await renderRequestsTable();
});

// Declarar el botón de filtrado
document.addEventListener('click', function(e) {
    if (e.target.id === 'filter-btn' || e.target.closest('#filter-btn')) {
        requestsFilter();
    }
});

// Declarar el botón del formulario
document.addEventListener('click', function(e) {
    if (e.target.id === 'btn-add' || e.target.closest('#btn-add')) {
        addRequests(e);
    }
});

// Acciones del modal de edición
const editModal = document.getElementById('edit-modal');
// Al abrir modal
editModal.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget;
    const vacationData = JSON.parse(button.getAttribute('vacation-data'));
    renderRequestsEditModal(vacationData);

    // Declarar el botón de guardado
    const btnSave = editModal.querySelector('#btn-save');
    // Elimina eventos anteriores para evitar duplicados
    btnSave.onclick = async function () {
        const doc = await generatePDF(vacationData);
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
    const idVacation = button.dataset.id;
    document.getElementById('delete-id-vacation').value = idVacation;
});
// Al cerrar modal
deleteModal.addEventListener('hidden.bs.modal', () => {
    document.getElementById('delete-id-vacation').value = '';
});