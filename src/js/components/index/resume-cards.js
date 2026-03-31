// Servicios Supabase
import { getActiveStaff } from "../../services/staff-service";
import { renderPresentCard, renderStaffCard } from "../attendance/attendance-cards";
import { getPermission } from "../../services/permissions-service";

let allStaff = [];
let allPermissions = [];

export async function createResumeCards(fullAttendances) {
    // Obtener empleados
    allStaff = await getActiveStaff();

    // Filtrar presentes (aquellos que tienen al menos una entrada)
    const presentAttendances = fullAttendances.filter(a => !!a.entrada);

    // Obtener solicitudes de vacaciones
    allPermissions = await getPermission();
    allPermissions = allPermissions.filter(r => r.estado == "Pendiente")

    renderStaffCard(allStaff)
    renderPresentCard(presentAttendances)
    renderRequestCard(allPermissions)
}

// Función para crear la card de solicitudes pendientes
export async function renderRequestCard(allPermissions) {
    const element = document.getElementById("request-text");
    // Limpiar elemento antes de insertar
    element.textContent = "";
    
    if (!allPermissions.length) {
        element.textContent = `-`;
        element.className = "general-report-cant text-muted";
        return;
    }

    // Generar el contenido
    element.textContent = `${allPermissions.length.toLocaleString('en-US')}`;
    element.className = `general-report-cant text-danger`;
}

