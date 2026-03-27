// Servicios Supabase
import { getActiveStaff } from "../../services/staff-service";
import { renderPresentCard, renderStaffCard } from "../attendance/attendance-cards";
import { getRequest } from "../../services/permissions-service";

let allStaff = [];
let allRequests = [];

export async function createResumeCards(fullAttendances) {
    // Obtener empleados
    allStaff = await getActiveStaff();

    // Filtrar presentes (aquellos que tienen al menos una entrada)
    const presentAttendances = fullAttendances.filter(a => !!a.entrada);

    // Obtener solicitudes de vacaciones
    allRequests = await getRequest();
    allRequests = allRequests.filter(r => r.estado == "Pendiente")

    renderStaffCard(allStaff)
    renderPresentCard(presentAttendances)
    renderRequestCard(allRequests)
}

// Función para crear la card de solicitudes pendientes
export async function renderRequestCard(allRequests) {
    const element = document.getElementById("request-text");
    // Limpiar elemento antes de insertar
    element.textContent = "";
    
    if (!allRequests.length) {
        element.textContent = `-`;
        element.className = "general-report-cant text-muted";
        return;
    }

    // Generar el contenido
    element.textContent = `${allRequests.length.toLocaleString('en-US')}`;
    element.className = `general-report-cant text-danger`;
}

