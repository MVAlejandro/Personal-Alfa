// Servicios Supabase
import { getAttendances, getFullAttendances } from "../../services/attendance-service";
import { getStaff } from "../../services/staff-service"; 
import { getUniforms, getUniformsResume } from "../../services/uniforms-service";
import { getVacations, getVacationsResume } from "../../services/vacations-service";

let allStaff = [];
let allAttendances = [];
let attendancesList = [];
let allUniforms = [];
let uniformsList = [];
let allVacations = [];
let vacationsList = [];

// Función para crear la tabla de personal
export async function renderStaffReportTable(staffParam = null) {
    // Obtener uniformes si no se pasa una lista filtrada
    if (staffParam) {
        allStaff = staffParam;
    } else {
        allStaff = await getStaff();
    }
    
    const tbody = document.querySelector('#staff-table tbody');

    // Limpiar tabla antes de insertar
    tbody.innerHTML = '';

    if (!allStaff || allStaff.length === 0) {
        tbody.innerHTML = `<tr><td class="text-center" colspan="5">No hay empleados registrados</td></tr>`;
        return;
    }

    for (const empleado of allStaff) {
        tbody.innerHTML +=
        `<tr>
            <td class="employee-id fw-bold p-2 ps-4">${empleado.numero_empleado}</td>
            <td class="employee-name p-2">${empleado.nombre}</td>
            <td class="employee-departament p-2">${empleado.puesto}</td>
            <td class="employee-birth text-center p-2">${empleado.fecha_nacimiento || "Sin Registro"}</td>
            <td class="employee-entry text-center p-2">${empleado.fecha_ingreso}</td>
            <td class="employee-rfc text-center p-2">${empleado.rfc || "Sin Registro"}</td>
            <td class="employee-status text-center p-2">${empleado.estatus}</td>
        </tr>`;
    };
}

// Función para crear la tabla de asistencias
export async function renderAttendanceReportTable(attendancesParam = null) {
    // Obtener asistencias si no se pasa una lista filtrada
    if (attendancesParam) {
        allAttendances = attendancesParam;
    } else {
        allAttendances = await getAttendances();
    }
    
    // Agrupar los registros de asistencia por empleado con sus horas de checado
    attendancesList = await getFullAttendances(allAttendances)

    const tbody = document.querySelector('#attendance-table tbody');
    
    // Limpiar tabla antes de insertar
    tbody.innerHTML = '';

    if (!attendancesList || attendancesList.length === 0) {
        tbody.innerHTML = `<tr><td class="text-center" colspan="6">No hay asistencias registradas</td></tr>`;
        return;
    }

    for (const asistencia of attendancesList) {
        tbody.innerHTML +=
        `<tr>
            <td class="attendance-number fw-bold p-2 ps-4">${asistencia.numero_empleado}</td>
            <td class="p-2">
                <p class="attendance-employee">${asistencia.nombre}</p>
                <p class="attendance-departament sub-text">${asistencia.puesto}</p>
            </td>
            <td class="attendance-date fw-bold text-center p-2">${asistencia.fecha || "Sin Registro"}</td>
            <td class="attendance-entrance text-center p-2">${asistencia.entrada.slice(0, 5) || "Sin Registro"}</td>
            <td class="attendance-exit text-center p-2">${asistencia.salida.slice(0, 5) || "Sin Registro"}</td>
            <td class="attendance-type text-center p-2">${asistencia.verificacion || "Sin Registro"}</td>
        </tr>`;
    };
}

// Función para crear la tabla de uniformes
export async function renderUniformsReportTable(uniformsParam = null) {
    // Obtener uniformes si no se pasa una lista filtrada
    if (uniformsParam) {
        allUniforms = uniformsParam;
    } else {
        allUniforms = await getUniforms();
    }

    // Agrupar los registros de uniformes por empleado
    uniformsList = await getUniformsResume(allUniforms)

    const tbody = document.querySelector('#uniforms-table tbody');

    // Limpiar tabla antes de insertar
    tbody.innerHTML = '';

    if (!uniformsList || uniformsList.length === 0) {
        tbody.innerHTML = `<tr><td class="text-center" colspan="8">No hay entregas de uniformes registradas</td></tr>`;
        return;
    }

    for (const uniforme of uniformsList) {
        tbody.innerHTML +=
        `<tr>
            <td class="uniform-employee-id fw-bold p-2 ps-4">${uniforme.numero_empleado}</td>
            <td class="p-2">
                <p class="uniform-employee">${uniforme.nombre}</p>
                <p class="uniform-departament sub-text">${uniforme.puesto}</p>
            </td>
            <td class="uniform-shoes text-center p-2">${uniforme.calzado}</td>
            <td class="uniform-tshirt text-center p-2">${uniforme.playera}</td>
            <td class="uniform-shirt text-center p-2">${uniforme.camisa}</td>
            <td class="uniform-pants text-center p-2">${uniforme.pantalon}</td>
        </tr>`;
    };
}

// Función para crear la tabla de vacaciones
export async function renderVacationsReportTable(vacationsParam = null) {
    // Obtener uniformes si no se pasa una lista filtrada
    if (vacationsParam) {
        allVacations = vacationsParam;
    } else {
        allVacations = await getVacations();
    }

    // Agrupar los registros de vacaciones por empleado
    vacationsList = await getVacationsResume(allVacations)

    const tbody = document.querySelector('#vacations-table tbody');

    // Limpiar tabla antes de insertar
    tbody.innerHTML = '';

    if (!vacationsList || vacationsList.length === 0) {
        tbody.innerHTML = `<tr><td class="text-center" colspan="8">No hay registros de vacaciones</td></tr>`;
        return;
    }

    for (const vacacion of vacationsList) {
        tbody.innerHTML +=
        `<tr>
            <td class="vacation-employee-id fw-bold p-2 ps-4">${vacacion.numero_empleado}</td>
            <td class="p-2">
                <p class="vacation-employee">${vacacion.nombre}</p>
                <p class="vacation-departament sub-text">${vacacion.puesto}</p>
            </td>
            <td class="p-2">
                <p class="vacation-entry-date">${vacacion.fecha_ingreso}</p>
                <p class="vacation-antique sub-text">Ant: ${vacacion.antiguedad} años</p>
            </td>
            <td class="vacation-total text-center p-2">${vacacion.dias_total}</td>
            <td class="vacation-taken text-center p-2">${vacacion.dias_tomados.length}</td>
            <td class="vacation-remain text-center p-2">${vacacion.dias_pendientes}</td>
        </tr>`;
    };
}