// Estilos generales
import './css/style.css';
import './css/pages/index.css';

// Estilos de componentes
import './css/components/navbar.css';
import './css/components/footer.css';

// Componentes JS
import './js/components/navbar.js';

// Servicios Supabase
import { initPage } from './js/utils/session-validate.js';
import { createResumeCards } from './js/components/index/resume-cards.js';
import { getAttendances } from './js/services/attendance-service.js';
import { renderRequestsTable } from './js/components/vacations/vacations-table.js';
import { getRequest } from './js/services/vacations-service.js';

document.addEventListener('DOMContentLoaded', async () => {
    const allAttendances = await getAttendances();
    let allRequests = await getRequest();

    const today = new Date().toISOString().split("T")[0];;
    const filtered = allAttendances.filter(a => a.fecha_asistencia === today);

    const dayText = document.getElementById('dayHeader');
    // Limpiar elementos antes de insertar
    dayText.innerHTML = "Semana 0";

    allRequests = allRequests.slice(-3)

    dayText.innerHTML = `${today}`;

    await initPage()
    createResumeCards(filtered)
    renderRequestsTable(allRequests)
})