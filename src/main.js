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
import { renderAttendanceGraphic, renderStaffGraphic } from './js/components/index/attendance-graphic.js';
import { getActiveStaff } from './js/services/staff-service.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Obtener la fecha actual
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0] || "-"
    // Primer día del mes
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayStr = firstDay.toISOString().split("T")[0];

    // Último día del mes
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const lastDayStr = lastDay.toISOString().split("T")[0];

    const allAttendances = await getSingleAttendances(todayStr);
    const activeStaff = await getActiveStaff(todayStr);
    const fullAttendances = await getFormatedAttendances(activeStaff, allAttendances);

    const dayText = document.getElementById('dayHeader');
    dayText.innerHTML = `${todayStr}`;

    await initPage()
    createResumeCards(todayStr, fullAttendances)
    renderStaffGraphic(todayStr)
    renderAttendanceGraphic(firstDayStr, lastDayStr, activeStaff)
})