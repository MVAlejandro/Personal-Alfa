// Estilos generales
import '../../css/style.css'
import '../../css/pages/uniforms.css'

// Estilos de componentes
import '../../css/components/navbar.css'
import '../../css/components/footer.css'

// Componentes JS
import '../components/navbar.js';
import '../components/uniforms/generate-form.js'

// Servicios Supabase
import { initPage } from '../utils/session-validate.js'; 
import { addUniforms } from '../components/uniforms/uniforms-form.js'; 
import { getUniformsResume } from '../services/uniforms-deliver-service.js';
import { uniformsFilter } from '../components/uniforms/uniforms-filter.js';
import { renderUniformsEditModal } from '../components/uniforms/uniforms-modal.js';

let register = []

document.addEventListener('DOMContentLoaded', async () => {
    await initPage()
    // Generar tabla con todos los registros
    register = await uniformsFilter();
});

// Declarar el botón de filtrado
document.addEventListener('click', async function(e) {
    if (e.target.id === 'filter-btn' || e.target.closest('#filter-btn')) {
        register = await uniformsFilter();
    }
});

// Declarar el botón del formulario
document.addEventListener('click', function(e) {
    if (e.target.id === 'btn-add' || e.target.closest('#btn-add')) {
        addUniforms(e);
    }
});

// Acciones del modal de edición
const editModal = document.getElementById('edit-modal');
// Al abrir modal
editModal.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget;
    const uniformData = JSON.parse(button.getAttribute('uniform-data'));
    renderUniformsEditModal(uniformData);
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
    const idDeliver = button.dataset.id;
    document.getElementById('delete-id-deliver').value = idDeliver;
});
// Al cerrar modal
deleteModal.addEventListener('hidden.bs.modal', () => {
    document.getElementById('delete-id-deliver').value = '';
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

    const uniformsList = await getUniformsResume(register);

    const ws = XLSX.utils.json_to_sheet(uniformsList);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, `Uniformes`);
    XLSX.writeFile(wb, `reporte_uniformes_${new Date().toISOString().split('T')[0]}.xlsx`);
});
