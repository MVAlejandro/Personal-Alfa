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
import { attendanceReportFilter } from '../components/attendance/attendance-report.js';

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
        // Seleccionar por defecto el filtro de Total
        const defaultRadio = document.querySelector('input[name="attendance-select"][value="Total"]');
        if (defaultRadio) defaultRadio.checked = true;
        // Ejecutar el filtro
        await attendanceFilter();
    }
});

// Declarar el botón del formulario
document.addEventListener('click', function(e) {
    if (e.target.id === 'btn-add-register' || e.target.closest('#btn-add-register')) {
        addExcelAttendances(e);
    }
});

// Declarar el botón de exportación a Excel
document.addEventListener('click', async function (e) {
    if (e.target.id === 'btn-report' || e.target.closest('#btn-report')) {

        // Obtener los registros para el reporte
        const report = await attendanceReportFilter();

        if (!report || !report.length) {
            Swal.fire({
                title: 'Atención',
                text: 'No hay datos para exportar.',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Transformar los datos para Excel
        const dataForExcel = report.map(r => ({
            "No. Emp": r.numero_empleado,
            "Nombre": r.nombre,
            "Puesto": r.puesto,
            "Fecha": r.fecha,
            "Detalle": r.detalle,
            "Día": r.detalle !== "Presente" ? r.tipo_dia : r.dia,
            "Entrada": r.entrada,
            "Variación E": r.variacion_entrada,
            "Salida": r.salida,
            "Variación S": r.variacion_salida,
            "Verificación": r.verificacion,
            "Tiempo extra": r.tiempo_extra
        }));

        const resultsText = document.getElementById('attendance-results');
        const filterValue = document.getElementById('status-report').value;
        // Actualizar texto de resultados
        if (!dataForExcel.length) {
            resultsText.textContent = `0 Registros generados`;
            return;
        }
        resultsText.textContent = `${dataForExcel.length} Registros generados`;

        // Generar Excel
        
        const ws = XLSX.utils.json_to_sheet(dataForExcel);
        const wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, `Reporte`);
        XLSX.writeFile(wb, `rep_asistencia_${new Date().toISOString().split('T')[0]}_${filterValue}.xlsx`);
        
    }
});

// Al cerrar modal formatear el texto
document.getElementById('report-modal').addEventListener('hidden.bs.modal', () => {
    const resultsText = document.getElementById('attendance-results');
    resultsText.textContent = `0 Registros generados`;
});