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
import { renderAttendanceGraphic, renderStaffGraphic } from './js/components/index/attendance-graphic.js';
import { getActiveStaff } from './js/services/staff-service.js';
import { getAbsences } from './js/services/absences-service.js';
import { getCalendarEvents } from './js/services/calendar-service.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Obtener la fecha actual
    const todayStr = new Date().toLocaleDateString('en-CA') || "-"

    const allAttendances = await getAttendances(todayStr);
    const allAbsences = await getAbsences(todayStr);
    const activeStaff = await getActiveStaff(todayStr);
    const fullAttendances = await getCalendarEvents(activeStaff, allAttendances, allAbsences);

    const dayText = document.getElementById('dayHeader');
    dayText.innerHTML = `${todayStr}`;

    await initPage()
    createResumeCards(todayStr, fullAttendances)
    renderStaffGraphic(todayStr)
    renderAttendanceGraphic(todayStr, todayStr, activeStaff)
})