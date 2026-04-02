import { formatWeekDay, entryColor, exitColor } from '../../utils/time-functions.js'

// Función para crear la tabla y la paginación
export async function renderAttendancesTable(attendancesList) {
    console.log(attendancesList);
    
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
        let entryClass = entryColor(asistencia.variacion_entrada);
        let exitClass = exitColor(asistencia.variacion_salida);

        tbody.innerHTML +=
        `<tr>
            <td class="attendance-number text-center p-2">${asistencia.numero_empleado}</td>
            <td class="attendance-employee p-2">${asistencia.nombre}</td>
            <td class="attendance-departament p-2">${asistencia.puesto}</td>
            <td class="attendance-day fw-bold text-center p-2">${formatWeekDay(asistencia.dia) || "Sin Registro"}</td>
            <td class="attendance-entrance text-center p-2">${asistencia.entrada.slice(0, 5) || "Sin Registro"}</td>
            <td class="attendance-extra-entrance text-center p-2" style="color:${entryClass} !important">${asistencia.variacion_entrada.slice(1,) || "-- : --"}</td>
            <td class="attendance-exit text-center p-2">${asistencia.salida.slice(0, 5) || "Sin Registro"}</td>
            <td class="attendance-extra-exit text-center p-2" style="color:${exitClass} !important">${asistencia.variacion_salida.slice(1,) || "-- : --"}</td>
            <td class="attendance-extra text-center p-2">${asistencia.tiempo_extra.slice(0, 5) || "Sin Registro"}</td>
        </tr>`;
    };

    // Actualizar texto de resultados
    resultsText.textContent = `Mostrando ${attendancesList.length} resultados`;
}