// Servicios Supabase
import { getActiveStaff } from "../../services/staff-service";

export async function createResumeCards(fullAttendances) {
    // Obtener todos los empleados activos
    const allStaff = await getActiveStaff();
    if (!allStaff) return;

    // Filtrar presentes (aquellos que tienen al menos una entrada)
    const presentAttendances = fullAttendances.filter(a => !!a.entrada);

    // Filtrar tardanzas (entrada después de las 08:05)
    const lateAttendances = presentAttendances.filter(a => a.entrada > "08:05");

    // Contar ausentes
    const absentCount = allStaff.length - presentAttendances.length;

    // Renderizar las cards
    renderStaffCard(allStaff);
    renderPresentCard(presentAttendances);
    renderLateCard(lateAttendances);
    renderAbsentCard(absentCount);
}

// Función para crear la card de empleados activos
export async function renderStaffCard(allStaff) {
    const element = document.getElementById("total-text");
    // Limpiar elemento antes de insertar
    element.textContent = "";
    
    if (!allStaff.length) {
        element.textContent = `-`;
        element.className = "general-report-cant text-muted";
        return;
    }

    // Generar el contenido
    element.textContent = `${allStaff.length.toLocaleString('en-US')}`;
    element.className = `general-report-cant`;
}

// Función para crear la card de empleados presentes
export async function renderPresentCard(firstAttendances) {
    const element = document.getElementById("present-text");
    // Limpiar elemento antes de insertar
    element.textContent = "";

    if (!firstAttendances.length) {
        element.textContent = `-`;
        element.className = "general-report-cant text-muted";
        return;
    }

    element.textContent = `${firstAttendances.length.toLocaleString('en-US')}`;
    element.className = "general-report-cant text-success";
}

// Función para crear la card de empleados con retardo
export async function renderLateCard(lateAttendances) {
    const element = document.getElementById("late-text");
    element.textContent = "";

    if (!lateAttendances.length) {
        element.textContent = `-`;
        element.className = "general-report-cant text-muted";
        return;
    }

    element.textContent = `${lateAttendances.length.toLocaleString('en-US')}`;
    element.className = `general-report-cant text-warning`;
}

// Función para crear la card de empleados ausentes
export async function renderAbsentCard(absentCount) {
    const element = document.getElementById("absence-text");
    element.textContent = "";

    if (absentCount <= 0) {
        element.textContent = `-`;
        element.className = "general-report-cant text-muted";
        return;
    }

    element.textContent = `${absentCount.toLocaleString('en-US')}`;
    element.className = `general-report-cant text-danger`;
}