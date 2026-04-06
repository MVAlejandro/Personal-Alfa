// Servicios Supabase
import { findStaffNumber } from '../../services/staff-service.js';
import { findSchedule } from '../../services/schedule-service.js';
import { createAttendance } from '../../services/attendance-service.js';
import { attendanceFilter } from './attendance-filter.js';
// Utilidades
import { textValidate, inputValidate } from '../../utils/form-validations.js';
import { determinateType, getWeekDay, minutesToTime, splitDateTime, timeToMinutes } from '../../utils/time-functions.js';

// Función para agregar registro de asistencias con el formato de Excel
export async function addExcelAttendances(event) {
    event.preventDefault();

    // Capturar el botón que disparó el evento
    const btn = event.target.closest('#btn-add-register');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = 'Subiendo...';
    }

    const form = document.getElementById('form-attendance');
    // Referencias para validación y errores
    const excelData = document.getElementById('excel-data').value
    const excelDataIn = document.getElementById('excel-data')
    const excelDataError = document.getElementById('error-excel-data')

    // Validaciones
    textValidate(excelDataIn, excelDataError)

    if (!excelData) {
        Swal.fire({
            title: 'Atención',
            text: 'Ingrese la información para agregar la entrada.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });

        // Restaurar estado del botón
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = 
                `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy pe-1" viewBox="0 0 16 16">
                    <path d="M11 2H9v3h2z"/>
                    <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
                </svg>
                <p class="ps-2">Agregar</p>`;
        }
        return
    }

    const campos = form.querySelectorAll('input')
    if (!inputValidate(campos)) {
        Swal.fire({
            title: 'Atención',
            text: 'Corrige los errores antes de guardar.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return
    }

    // Dividir las filas y columnas
    const rows = excelData.split('\n');
    let insertedAttendances = 0;

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const columns = row.split('\t');
        if (columns.length !== 3) {
            continue;
        }

        const tiempo_asistencia = columns[0].trim();
        const numero_empleado = columns[1].trim();
        const verificación = columns[2].trim();
        // Determinar la información extra con ayuda de las funciones
        const id_empleado = await findStaffNumber(numero_empleado);
        const time = splitDateTime(tiempo_asistencia);
        const dia = getWeekDay(time.date)
        const tipo = await determinateType(id_empleado, dia, time.hour);
        const horario = await findSchedule(id_empleado, dia);
        let variacion = "";
        // Calcular variaciones de tiempo en base al horario del empleado
        if (!horario) {
            console.warn(`Fila ${i + 1} ignorada: sin horario para empleado ${numero_empleado}`);
            continue;
        }
        
        const horaRealMin = timeToMinutes(time.hour);

        if (tipo === 'Entrada') {
            const entradaHorarioMin = timeToMinutes(horario.entrada);
            variacion = minutesToTime(horaRealMin - entradaHorarioMin);
        }

        if (tipo === 'Salida') {
            const salidaHorarioMin = timeToMinutes(horario.salida);
            variacion = minutesToTime(horaRealMin - salidaHorarioMin);
        }

        if (id_empleado == null) {
            console.warn(`Fila ${i + 1} ignorada: empleado con número ${numero_empleado} no encontrado`)
            continue
        }

        // Insertar en Supabase
        const newAssistanceData = {
            id_empleado,
            fecha_asistencia: time.date,
            hora_asistencia: time.hour,
            tipo,
            variacion,
            dia,
            verificación
        };

        try {
            const result = await createAttendance(newAssistanceData);

            if (result.duplicate) {
                console.warn(`Fila ${i + 1} ignorada: registro duplicado para empleado ${numero_empleado} en ${time.date} ${time.hour}`);
                continue;
            }

            if (result.inserted) {
                insertedAttendances++;
            }

        } catch (err) {
            console.error(`Error al insertar fila ${i + 1}:`, newAssistanceData, err);
            Swal.fire({
                title: 'Oops...',
                text: 'Ocurrió un error al registrar la asistencia.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }

    Swal.fire({
        title: 'Registro agregado con éxito.',
        text: `Se agregaron ${insertedAttendances} registros.`,
        icon: 'success',
        confirmButtonText: 'OK'
    });
    
    form.reset();
    form.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
        e.classList.remove('is-valid', 'is-invalid');
    });

    // Restaurar estado del botón
    if (btn) {
        btn.disabled = false;
        btn.innerHTML = 
            `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy pe-1" viewBox="0 0 16 16">
                <path d="M11 2H9v3h2z"/>
                <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
            </svg>
            <p class="ps-2">Agregar</p>`;
    }

    // Recarga la tabla con los datos actualizados
    await attendanceFilter();
};