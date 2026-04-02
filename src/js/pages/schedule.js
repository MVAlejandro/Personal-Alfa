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
import { renderExtraTimeModal } from '../components/extra-time/extra-modal.js';

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

// Acciones del modal de horas extra
const extraModal = document.getElementById('extra-modal');
// Al abrir modal
extraModal.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget;
    const idData = button.getAttribute('staff-id');
    const staffData = button.getAttribute('staff-data');
    renderExtraTimeModal(idData, staffData);
});
// Al cerrar modal
extraModal.addEventListener('hidden.bs.modal', () => {
    extraModal.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
        e.classList.remove('is-valid', 'is-invalid');
    });

    extraModal.querySelectorAll('input, select').forEach(el => {
        el.value = '';
    });
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

    const dataForExcel = register.map(r => ({
        "No. Empleado": r.numero_empleado,
        "Nombre": r.nombre,
        "Puesto": r.puesto,
        "Lunes": `${r.dias[0].entrada != null ? r.dias[0].entrada.slice(0, 5) : "00:00"} - ${r.dias[0].salida != null ? r.dias[0].salida.slice(0, 5) : "00:00"}`,
        "Martes": `${r.dias[1].entrada != null ? r.dias[1].entrada.slice(0, 5) : "00:00"} - ${r.dias[1].salida != null ? r.dias[1].salida.slice(0, 5) : "00:00"}`,
        "Miércoles": `${r.dias[2].entrada != null ? r.dias[2].entrada.slice(0, 5) : "00:00"} - ${r.dias[2].salida != null ? r.dias[2].salida.slice(0, 5) : "00:00"}`,
        "Jueves": `${r.dias[3].entrada != null ? r.dias[3].entrada.slice(0, 5) : "00:00"} - ${r.dias[3].salida != null ? r.dias[3].salida.slice(0, 5) : "00:00"}`,
        "Viernes": `${r.dias[4].entrada != null ? r.dias[4].entrada.slice(0, 5) : "00:00"} - ${r.dias[4].salida != null ? r.dias[4].salida.slice(0, 5) : "00:00"}`,
        "Sábado": `${r.dias[5].entrada != null ? r.dias[5].entrada.slice(0, 5) : "00:00"} - ${r.dias[5].salida != null ? r.dias[5].salida.slice(0, 5) : "00:00"}`,
        "Domingo": `${r.dias[6].entrada != null ? r.dias[6].entrada.slice(0, 5) : "00:00"} - ${r.dias[6].salida != null ? r.dias[6].salida.slice(0, 5) : "00:00"}`,
    }));

    const ws = XLSX.utils.json_to_sheet(dataForExcel);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Horarios');
    XLSX.writeFile(wb, `reporte_horarios_${new Date().toISOString().split('T')[0]}.xlsx`);
});