// Servicios Supabase
import { validateUserRole } from '../../utils/session-validate.js';

function determinateSchedule(dia) {
    let entrada = "00:00";
    let salida = "00:00";

    if (dia.entrada != null) {
        entrada = dia.entrada.slice(0, 5);
    }

    if (dia.salida != null) {
        salida = dia.salida.slice(0, 5);
    }

    let horario = `${entrada} - ${salida}`;

    if (horario == "00:00 - 00:00") {
        return "Descanso"
    } else {
        return horario
    }
}

// Función para crear la tabla y la paginación
export async function renderSchedulesTable(staffSchedules) {
    const tbody = document.querySelector('#schedule-table tbody');

    // Limpiar tabla antes de insertar
    tbody.innerHTML = '';

    if (!staffSchedules || staffSchedules.length === 0) {
        tbody.innerHTML = `<tr><td class="text-center" colspan="10">No hay horarios registrados</td></tr>`;
        return;
    }

    for (const horario of staffSchedules) {
        tbody.innerHTML +=
        `<tr>
            <td class="schedule-employee-id fw-bold p-1 text-center">${horario.numero_empleado}</td>
            <td class="p-1">
                <p class="schedule-employee">${horario.nombre}</p>
                <p class="schedule-departament">${horario.puesto}</p>
            </td>
            <td class="schedule-day text-center p-1">${determinateSchedule(horario.dias[0])}</td>
            <td class="schedule-day text-center p-1">${determinateSchedule(horario.dias[1])}</td>
            <td class="schedule-day text-center p-1">${determinateSchedule(horario.dias[2])}</td>
            <td class="schedule-day text-center p-1">${determinateSchedule(horario.dias[3])}</td>
            <td class="schedule-day text-center p-1">${determinateSchedule(horario.dias[4])}</td>
            <td class="schedule-day text-center p-1">${determinateSchedule(horario.dias[5])}</td>
            <td class="schedule-day text-center p-1">${determinateSchedule(horario.dias[6])}</td>
            <td class="schedule-controls text-end p-2 pe-4 d-none" data-rh-only data-dir-only>
                <div class="action-buttons">
                    <button class="btn btn-edit d-none" data-rh-only data-bs-target="#edit-modal" data-bs-toggle="modal" title="Editar horario"
                        schedule-data='${JSON.stringify(horario)}'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                        </svg>
                    </button>
                    <button class="btn btn-add d-none" data-rh-only data-dir-only data-bs-target="#extra-modal" data-bs-toggle="modal" title="Registrar horas extra"
                        staff-id='${horario.id_empleado}' staff-data='${horario.nombre}'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>`;
    };
    
    validateUserRole()
}