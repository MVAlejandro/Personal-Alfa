// Estilos generales
import '../../css/style.css'
import '../../css/pages/attendance.css'

// Estilos de componentes
import '../../css/components/navbar.css'
import '../../css/components/footer.css'

// Componentes JS
import '../components/navbar.js';
import '../components/attendance/generate-form.js'

// Servicios Supabase
import { initPage } from '../utils/session-validate.js';
import { addExcelAttendances } from '../components/attendance/attendance-form.js'; 
import { attendanceFilter } from '../components/attendance/attendance-filter.js';
import { attendanceReport, attendanceReportFilter } from '../components/attendance/attendance-report.js';

let report = []

document.addEventListener('DOMContentLoaded', async () => {
    await initPage()
    // Generar tabla con el día actual
    await attendanceFilter();
    document.getElementById('attendance-resume-container').addEventListener('change', async function (e) {
        if (e.target.matches('input[name="attendance-select"]')) {
            await attendanceFilter();
        }
    });
});

// Declarar el botón de filtrado
document.addEventListener('click', async function (e) {
    if (e.target.id === 'filter-btn' || e.target.closest('#filter-btn')) {
        // Quitar selección de todos los radios
        document.querySelectorAll('input[name="attendance-select"]').forEach(radio => radio.checked = false);
        // Ejecutar filtro
        await attendanceFilter();
    }
});

// Declarar el botón del formulario
document.addEventListener('click', function(e) {
    if (e.target.id === 'btn-add-register' || e.target.closest('#btn-add-register')) {
        addExcelAttendances(e);
    }
});

// Declarar el botón para la generación del gráfico
document.addEventListener('click', function(e) {
    if (e.target.id === 'btn-generate' || e.target.closest('#btn-generate')) {
        attendanceReport(e);
    }
});

// Declarar el botón para generación del reporte
document.addEventListener('click', async function (e) {
    if (e.target.id === 'btn-report' || e.target.closest('#btn-report')) {

        const btn = e.target.closest('#btn-report');

        try {
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = 'Exportando...';
            }

            const report = await attendanceReportFilter();

            if (!report.length) {
                Swal.fire({
                    title: 'Atención',
                    text: 'No hay datos para exportar.',
                    icon: 'warning'
                });
                return;
            }

            const dataForExcel = report.map(r => ({
                "No. Emp": r.numero_empleado,
                "Nombre": r.nombre,
                "Puesto": r.puesto,
                "Fecha": r.fecha,
                "Detalle": r.detalle,
                "Día": r.detalle !== "Presente" && r.detalle !== "Retardo" ? r.tipo_dia : r.dia,
                "Entrada": r.entrada,
                "Variación E": r.variacion_entrada,
                "Salida": r.salida,
                "Variación S": r.variacion_salida,
                "Verificación": r.verificacion,
                "Tiempo extra": r.tiempo_extra
            }));

            const ws = XLSX.utils.json_to_sheet(dataForExcel);
            const wb = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(wb, ws, `Reporte`);

            XLSX.writeFile(
                wb,
                `rep_asistencia_${new Date().toISOString().split('T')[0]}.xlsx`
            );

        } catch (error) {
            if (error.message === 'NO_DATE') {
                Swal.fire({
                    title: 'Atención',
                    text: 'Seleccione al menos una fecha.',
                    icon: 'warning'
                });
            }
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = 
                    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-table" viewBox="0 0 16 16">
                        <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 2h-4v3h4zm0 4h-4v3h4zm0 4h-4v3h3a1 1 0 0 0 1-1zm-5 3v-3H6v3zm-5 0v-3H1v2a1 1 0 0 0 1 1zm-4-4h4V8H1zm0-4h4V4H1zm5-3v3h4V4zm4 4H6v3h4z"/>
                    </svg>
                    <p class="ps-2">Guardar</p>`;
            }
        }
    }
});

// Al cerrar modal formatear el modal
document.getElementById('report-modal').addEventListener('hidden.bs.modal', () => {
    const container = document.getElementById('graphic-report-container');
    container.innerHTML = 
        `<div id="report-container" class="h-100 container d-flex justify-content-center align-items-center">
            <div id="logo-info" class="text-center">
                <h4 class="fw-light mb-4">Seleccione el periodo de tiempo para generar.</h4>
                <img src="./assets/images/logo-letras-420x187.png" alt="Logo Pallets Alfa" class="w-75 img-fluid">
            </div>
        </div>`;
});