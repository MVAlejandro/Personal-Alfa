// Servicios Supabase
import { createAttendance, findEmployee } from '../../services/attendance-service.js'; 
import { renderAttendancesTable } from './attendance-table.js'; 
// Utilidades
import { textValidate, inputValidate } from '../../utils/form-validations.js';

// Función para separar el formato de tiempo en día y hora
function splitDateTime(fechaTexto) {
    const [date, hour] = fechaTexto.trim().split(' ');
    const [day, month, year] = date.split('/');
    return { date: `${year}-${month}-${day}`, hour };
}

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

    for (let row of rows) {
        const columns = row.split('\t');
        if (columns.length < 4) continue;

        const tiempo_asistencia = columns[0].trim();
        const numero_empleado = columns[1].trim();
        const nombre = columns[2].trim();
        const verificación = columns[3].trim();

        const time = splitDateTime(tiempo_asistencia);
        const id_empleado = await findEmployee(numero_empleado);

        if (id_empleado == null) {
            console.warn(`Empleado con número ${numero_empleado} no encontrado`)
            continue
        }

        // Insertar en Supabase
        const newAssistanceData = {
            fecha_asistencia: time.date,
            hora_asistencia: time.hour,
            id_empleado,
            nombre,
            verificación
        };

        try {
            await createAttendance(newAssistanceData);
            insertedAttendances++;
        } catch (err) {
            console.error('Error al insertar registro:', newAssistanceData, err);
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
    await renderAttendancesTable();
};