// Estilos generales
import '../../css/style.css'
import '../../css/pages/reports.css'

// Estilos de componentes
import '../../css/components/navbar.css'
import '../../css/components/footer.css'

// Componentes JS
import '../components/navbar.js';

// Servicios Supabase
import { initPage } from '../utils/session-validate.js';
import { generateAttendanceReport, generateStaffReport, generateUniformsReport, generateVacationsReport } from '../components/reports/generate-report.js';

document.addEventListener('DOMContentLoaded', async () => {
    await initPage()
    document.getElementById('report-select-container').addEventListener('change', function(e) {
        const value = e.target.value;
        const infoContainer = document.getElementById('content-info');
        const filterContainer = document.getElementById('reports-filter-container');
        const reportContainer = document.getElementById('report-container');

        // Limpiar contenido anterior
        infoContainer.innerHTML = "";
        infoContainer.classList.add('d-none');
        filterContainer.innerHTML = "";
        filterContainer.classList.remove('d-none');
        reportContainer.innerHTML = "";
        reportContainer.classList.remove('d-none');

        switch (value) {
            case 'Personal':
                generateStaffReport();
                break;
            case 'Asistencia':
                generateAttendanceReport();
                break;
            case 'Uniformes':
                generateUniformsReport();
                break;
            case 'Vacaciones':
                generateVacationsReport();
                break;
        }
    });
});
