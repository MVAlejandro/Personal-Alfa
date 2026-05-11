// Servicios Supabase
import { getActiveStaff } from "../../services/staff-service";

export async function createResumeCards(date, fullAttendances) {
    // Obtener todos los empleados activos
    const allStaff = await getActiveStaff(date);
    if (!allStaff) return;
console.log(fullAttendances);

    // Presentes normales
    const attendanceCount = fullAttendances.filter(a => a.tipo_dia === "Laborado" && a.detalle === "Presente");
    // Retardos
    const lateCount = fullAttendances.filter(a => a.tipo_dia === "Laborado" && a.detalle === "Retardo");
    // Faltas
    const absentCount = fullAttendances.filter(a => a.tipo_dia === "Falta");
    // Permisos y vacaciones
    const permissionCount = fullAttendances.filter(a => a.tipo_dia === "Permiso" || a.tipo_dia === "Vacaciones");

    // Calcular porcentajes
    const attendancePercent = fullAttendances.length ? (attendanceCount.length / fullAttendances.length) * 100 : 0;
    const absentPercent = fullAttendances.length ? (absentCount.length / fullAttendances.length) * 100 : 0;
    const permissionPercent = fullAttendances.length ? (permissionCount.length / fullAttendances.length) * 100 : 0;
    const latePercent = fullAttendances.length ? (lateCount.length / fullAttendances.length) * 100 : 0;

    // Mostrar el total de empleados activos
    document.getElementById("total-text").innerHTML = "Total Personal: -";
    document.getElementById("total-text").innerHTML = `Total Personal: ${allStaff.length}`;

    // Renderizar las cards
    renderPresentCard(attendanceCount, attendancePercent);
    renderLateCard(lateCount, latePercent);
    renderAbsentCard(absentCount, absentPercent);
    renderPermissionCard(permissionCount, permissionPercent);
}

// Función para crear la card de empleados presentes
export async function renderPresentCard(attendanceCount, attendancePercent) {
    const element = document.getElementById("present-text");
    // Limpiar elemento antes de insertar
    element.textContent = "";

    if (!attendanceCount.length) {
        element.innerHTML = 
            `<p class="general-report-cant text-muted">-</p>`;
        return;
    }

    // Generar el contenido
    element.innerHTML = 
        `<p class="general-report-cant text-success">
            ${attendanceCount.length.toLocaleString('en-US')} <small>(${attendancePercent.toFixed(1)}%)</small>
        </p>`;
}

// Función para crear la card de empleados con retardo
export async function renderLateCard(lateCount, latePercent) {
    const element = document.getElementById("late-text");
    element.textContent = "";

    if (!lateCount.length) {
        element.innerHTML = 
            `<p class="general-report-cant text-muted">-</p>`;
        return;
    }

    // Generar el contenido
    element.innerHTML = 
        `<p class="general-report-cant text-warning">
            ${lateCount.length.toLocaleString('en-US')} <small>(${latePercent.toFixed(1)}%)</small>
        </p>`;
}

// Función para crear la card de empleados ausentes
export async function renderAbsentCard(absentCount, absentPercent) {
    const element = document.getElementById("absence-text");
    element.textContent = "";

    if (!absentCount.length) {
        element.innerHTML = 
            `<p class="general-report-cant text-muted">-</p>`;
        return;
    }

    // Generar el contenido
    element.innerHTML = 
        `<p class="general-report-cant text-danger">
            ${absentCount.length.toLocaleString('en-US')} <small>(${absentPercent.toFixed(1)}%)</small>
        </p>`;
}

// Función para crear la card de empleados con permiso
export async function renderPermissionCard(permissionCount, permissionPercent) {
    const element = document.getElementById("permission-text");
    // Limpiar elemento antes de insertar
    element.textContent = "";
    
    if (!permissionCount.length) {
        element.innerHTML = 
            `<p class="general-report-cant text-muted">-</p>`;
        return;
    }

    // Generar el contenido
    element.innerHTML = 
        `<p class="general-report-cant text-primary">
            ${permissionCount.length.toLocaleString('en-US')} <small>(${permissionPercent.toFixed(1)}%)</small>
        </p>`;
}