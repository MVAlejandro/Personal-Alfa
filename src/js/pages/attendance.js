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
// import { initPage } from '../utils/session-validate.js';
import { addExcelAttendances } from '../components/attendance/attendance-form.js'; 
import { attendanceFilter } from '../components/attendance/attendance-filter.js';

let register = []

document.addEventListener('DOMContentLoaded', async () => {
    //await initPage()
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
document.getElementById("export-btn").addEventListener('click', function() {
    if (!register.length) {
        Swal.fire({
            title: 'Atención',
            text: 'No hay datos para exportar.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return;
    }

    const grouped = {};

    register.forEach(r => {
        const key = `${r.id_empleado}-${r.fecha_asistencia}`;

        if (!grouped[key]) {
            grouped[key] = {
                id_empleado: r.id_empleado,
                numero_empleado: r.numero_empleado,
                nombre: r.nombre,
                puesto: r.puesto,
                fecha: r.fecha_asistencia,
                horas: []
            };
        }

        grouped[key].horas.push(r.hora_asistencia);
    });

    const dataForExcel = Object.values(grouped).map(g => {
    const horasOrdenadas = g.horas.sort(); // ordena horas ascendente

        return {
            ID: g.numero_empleado,
            Nombre: g.nombre,
            Puesto: g.puesto,
            Fecha: g.fecha,
            Entrada: horasOrdenadas[0] || "",
            Salida: horasOrdenadas.length > 1 
                ? horasOrdenadas[horasOrdenadas.length - 1] 
                : ""
        };
    });

    const ws = XLSX.utils.json_to_sheet(dataForExcel);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, `${register[0].fecha_asistencia}`);
    XLSX.writeFile(wb, `reporte_asistencia_${new Date().toISOString().split('T')[0]}.xlsx`);
});