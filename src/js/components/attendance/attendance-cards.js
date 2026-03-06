// Servicios Supabase
import { getActiveStaff } from "../../services/staff-service";
import { getAttendances } from "../../services/attendance-service";

let allStaff = [];
let allAttendances = [];
let firstAttendances = [];
let lateAttendances = [];

export async function createResumeCards(attendancesParam = null) {
    // Obtener empleados
    allStaff = await getActiveStaff();
    if (!allStaff) return;
    // Obtener asistencias
    if (attendancesParam) {
        allAttendances = attendancesParam;
    } else {
        allAttendances = await getAttendances();
    }
    // Filtrar solo primer coincidencia de fecha y empleado
    firstAttendances = allAttendances.filter((item, index, array) => {
        return index === array.findIndex(obj =>
            obj.fecha_asistencia === item.fecha_asistencia &&
            obj.id_empleado === item.id_empleado
        );
    });
    // Filtrar registros de checado con retardo
    lateAttendances = firstAttendances.filter(a => a.hora_asistencia > "08:05");
    
    renderStaffCard(allStaff)
    renderPresentCard(firstAttendances)
    renderLateCard()
    renderAbsentCard()
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
export async function renderLateCard() {
    const element = document.getElementById("late-text");
    // Limpiar elemento antes de insertar
    element.textContent = "";

    if (!lateAttendances.length) {
        element.textContent = `-`;
        element.className = "general-report-cant text-muted";
        return;
    }

    element.textContent = `${lateAttendances.length.toLocaleString('en-US')}`;
    element.className = `general-report-cant text-warning`
}

// Función para crear la card de empleados ausentes
export async function renderAbsentCard() {
    const element = document.getElementById("absence-text");
    // Limpiar elemento antes de insertar
    element.textContent = "";

    if (!allAttendances.length) {
        element.textContent = `-`;
        element.className = "general-report-cant text-muted";
        return;
    }
    
    // Generar el contenido
    element.textContent = `${(allStaff.length-firstAttendances.length).toLocaleString('en-US')}`;
    element.className = `general-report-cant text-danger`
}