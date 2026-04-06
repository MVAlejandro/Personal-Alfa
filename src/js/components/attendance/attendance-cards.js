// Servicios Supabase
import { getActiveStaff } from "../../services/staff-service";

export async function createResumeCards(fullAttendances) {
    // Obtener todos los empleados activos
    const allStaff = await getActiveStaff();
    if (!allStaff) return;

    // Filtrar presentes (aquellos que tienen al menos una entrada o salida)
    const presentAttendances = fullAttendances.filter(a => !!a.entrada || !!a.salida);

    // Filtrar retardos (entrada con variacion_entrada > +00:05)
    const lateAttendances = presentAttendances.filter(a => {
        const variacion = a.variacion_entrada;
        if (!variacion) return false;

        const match = variacion.match(/([+-])(\d{2}):(\d{2})/);
        if (!match) return false;

        const sign = match[1];
        const hours = parseInt(match[2], 10);
        const minutes = parseInt(match[3], 10);
        const totalMinutes = hours * 60 + minutes;

        return sign === '+' && totalMinutes > 5;
    });

    // Filtrar ausentes (aquellos que no tienen al entrada o salida)
    const absentCount = fullAttendances.filter(a => !a.entrada && !a.salida);

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

    if (!absentCount.length) {
        element.textContent = `-`;
        element.className = "general-report-cant text-muted";
        return;
    }

    element.textContent = `${absentCount.length.toLocaleString('en-US')}`;
    element.className = `general-report-cant text-danger`;
}