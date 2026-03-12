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
import { getFullAttendances } from '../services/attendance-service.js';

let register = []

document.addEventListener('DOMContentLoaded', async () => {
    await initPage()
    // Generar tabla con el día actual
    register = await attendanceFilter();
});

// Declarar el botón de filtrado
document.addEventListener('click', async function(e) {
    if (e.target.id === 'filter-btn' || e.target.closest('#filter-btn')) {
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

    const dataForExcel = await getFullAttendances(register)

    const formattedData = dataForExcel.map(r => ({
        "No. Empleado": r.numero_empleado,
        "Nombre": r.nombre,
        "Puesto": r.puesto,
        "Fecha": r.fecha,
        "Entrada": r.entrada,
        "Salida": r.salida,
        "Verificación": r.verificacion
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, `${register[0].fecha_asistencia}`);
    XLSX.writeFile(wb, `reporte_asistencia_${new Date().toISOString().split('T')[0]}.xlsx`);
});