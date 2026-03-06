// Servicios Supabase
import { getActiveStaff } from "../../services/staff-service";
import { getAttendances } from "../../services/attendance-service"; 
import { renderPresentCard, renderStaffCard } from "../attendance/attendance-cards";
import { getRequest } from "../../services/vacations-service";

let allStaff = [];
let allAttendances = [];
let firstAttendances = [];
let allRequests = [];

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
    // Obtener solicitudes de vacaciones
    allRequests = await getRequest();
    allRequests = allRequests.filter(r => r.estado == "Pendiente")

    renderStaffCard(allStaff)
    renderPresentCard(firstAttendances)
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

