// Estilos generales
import '../../css/style.css'
import '../../css/pages/schedule.css'

// Estilos de componentes
import '../../css/components/navbar.css'
import '../../css/components/footer.css'

// Componentes JS
import '../components/navbar.js';

// Servicios Supabase
import { initPage } from '../utils/session-validate.js';
import { schedulesFilter } from '../components/schedule/schedule-filter.js';
import { renderScheduleEditModal } from '../components/schedule/schedule-modal.js'; 

let register = []

document.addEventListener('DOMContentLoaded', async () => {
    await initPage()
    // Generar la tabla inicial
    register = await schedulesFilter();
});

// Declarar el botón de filtrado
document.addEventListener('click', async function(e) {
    if (e.target.id === 'filter-btn' || e.target.closest('#filter-btn')) {
        register = await schedulesFilter();
    }
});

// Acciones del modal de edición
const editModal = document.getElementById('edit-modal');
// Al abrir modal
editModal.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget;
    const scheduleData = JSON.parse(button.getAttribute('schedule-data'));
    renderScheduleEditModal(scheduleData);
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