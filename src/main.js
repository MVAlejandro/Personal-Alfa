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
import { getFormatedAttendances, getSingleAttendances } from './js/services/attendance-service.js';

document.addEventListener('DOMContentLoaded', async () => {
    const today = new Date().toISOString().split("T")[0] || "-";
    const allAttendances = await getSingleAttendances(today);
    
    const fullAttendances = await getFormatedAttendances(allAttendances);

    const dayText = document.getElementById('dayHeader');
    dayText.innerHTML = `${today}`;

    await initPage()
    createResumeCards(fullAttendances)
})