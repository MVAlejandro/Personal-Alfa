// Servicios Supabase
import { validateUserRole } from '../../utils/session-validate.js';

// Función para crear la tabla y la paginación
export async function renderAttendancesTable(attendancesList) {
    const tbody = document.querySelector('#attendance-table tbody');
    const resultsText = document.getElementById('attendance-pages-results');
    
    // Limpiar tabla antes de insertar
    tbody.innerHTML = '';

    if (!attendancesList || attendancesList.length === 0) {
        tbody.innerHTML = `<tr><td class="text-center" colspan="8">No hay asistencias registradas</td></tr>`;
        resultsText.textContent = `Mostrando 0 resultados`;
        return;
    }

    for (const asistencia of attendancesList) {
        let timeClass = '';
        if (asistencia.entrada > "08:05") {
            timeClass = 'orange';
        } else if (asistencia.entrada == '') {
            timeClass = 'red';
        } else {
            timeClass = 'black';
        }

        tbody.innerHTML +=
        `<tr>
            <td class="attendance-number text-center p-2">${asistencia.numero_empleado}</td>
            <td class="attendance-employee p-2">${asistencia.nombre}</td>
            <td class="attendance-departament p-2">${asistencia.puesto}</td>
            <td class="attendance-date fw-bold text-center p-2">${asistencia.fecha || "Sin Registro"}</td>
            <td class="attendance-entrance text-center p-2" style="color:${timeClass} !important">${asistencia.entrada.slice(0, 5) || "Sin Registro"}</td>
            <td class="attendance-exit text-center p-2">${asistencia.salida.slice(0, 5) || "Sin Registro"}</td>
            <td class="attendance-type text-center p-2">${asistencia.verificacion || "Sin Registro"}</td>
        </tr>`;
    };

    // Actualizar texto de resultados
    resultsText.textContent = `Mostrando ${attendancesList.length} resultados`;
    
    validateUserRole()
}