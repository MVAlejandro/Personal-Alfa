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

let register = []

document.addEventListener('DOMContentLoaded', async () => {
    await initPage()
    // Generar tabla con el día actual
    register = await attendanceFilter();
    document.getElementById('attendance-resume-container').addEventListener('change', async function (e) {
        if (e.target.matches('input[name="attendance-select"]')) {
            register = await attendanceFilter();
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
        register = await attendanceFilter();
    }
});

// Declarar el botón del formulario
document.addEventListener('click', function(e) {
    if (e.target.id === 'btn-add-register' || e.target.closest('#btn-add-register')) {
        addExcelAttendances(e);
    }
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
        "Fecha": r.fecha,
        "Día": r.dia,
        "Entrada": r.entrada,
        "Variación E": r.variacion_entrada,
        "Salida": r.salida,
        "Variación S": r.variacion_salida,
        "Verificación": r.verificacion,
        "Tiempo extra": r.tiempo_extra
    }));

    const ws = XLSX.utils.json_to_sheet(dataForExcel);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, `${register[0].fecha_asistencia}`);
    XLSX.writeFile(wb, `reporte_asistencia_${new Date().toISOString().split('T')[0]}.xlsx`);
});