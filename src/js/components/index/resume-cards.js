// Servicios Supabase
import { getPermission } from "../../services/permissions-service";

let allPermissions = [];

export async function createResumeCards(date, fullAttendances) {
    // Total de registros
    const total = fullAttendances.length;

    // Filtrar presentes
    const attendanceCount = fullAttendances.filter(a => a.tipo_dia == "Laborado");

    // Filtrar ausentes
    const absentCount = fullAttendances.filter(a => a.tipo_dia == "Falta");

    // Calcular porcentajes
    const attendancePercent = total ? (attendanceCount.length / total) * 100 : 0;
    const absentPercent = total ? (absentCount.length / total) * 100 : 0;

    // Obtener solicitudes de vacaciones
    allPermissions = await getPermission();
    allPermissions = allPermissions.filter(r => r.estado == "Pendiente");

    renderPresentCard(attendancePercent);
    renderAbsentCard(absentPercent);
    renderRequestCard(allPermissions);
}

// Función para crear la card de empleados presentes
export async function renderPresentCard(attendancePercent) {
    const element = document.getElementById("present-text");
    element.textContent = "";

    if (!attendancePercent) {
        element.textContent = `0%`;
        element.className = "general-report-cant text-muted";
        return;
    }

    element.textContent = `${attendancePercent.toFixed(1)}%`;
    element.className = "general-report-cant text-success";
}

// Función para crear la card de empleados ausentes
export async function renderAbsentCard(absentPercent) {
    const element = document.getElementById("absence-text");
    element.textContent = "";

    if (!absentPercent) {
        element.textContent = `0%`;
        element.className = "general-report-cant text-muted";
        return;
    }

    element.textContent = `${absentPercent.toFixed(1)}%`;
    element.className = "general-report-cant text-danger";
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
    element.className = `general-report-cant text-warning`;
}

