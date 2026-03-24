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
import { getVacationsResume } from '../services/vacations-service.js';
import { requestsFilter } from '../components/vacations/vacations-filter.js';
import { renderRequestsEditModal } from '../components/vacations/vacations-modal.js';
import { generatePDF } from '../components/vacations/vacations-print.js';

let register = []

document.addEventListener('DOMContentLoaded', async () => {
    await initPage()
    // Generar tabla con todos los registros
    register = await requestsFilter();
});

// Declarar el botón de filtrado
document.addEventListener('click', async function(e) {
    if (e.target.id === 'filter-btn' || e.target.closest('#filter-btn')) {
        register = await requestsFilter();
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

    const vacationsList = await getVacationsResume(register);

    const ws = XLSX.utils.json_to_sheet(vacationsList);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, `Vacaciones`);
    XLSX.writeFile(wb, `reporte_vacaciones_${new Date().toISOString().split('T')[0]}.xlsx`);
});