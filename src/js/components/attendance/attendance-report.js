// Servicios Supabase
import { getActiveStaffRange } from '../../services/staff-service.js';  
import { getRangeAttendances } from '../../services/attendance-service.js'; 
import { getRangeAbsences } from '../../services/absences-service.js';
import { getCalendarEvents } from '../../services/calendar-service.js';

let allAttendances = [];
let allAbsences = [];

document.addEventListener('DOMContentLoaded', () => { 
    flatpickr("#date-report", {
        locale: {
            ...flatpickr.l10ns.es,
            firstDayOfWeek: 0
        },
        mode: "range",
        dateFormat: "Y-m-d",

        onChange: function(selectedDates, dateStr, instance) {
            if (selectedDates.length === 2) {
                const diffTime = Math.abs(selectedDates[1] - selectedDates[0]);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                const maxDays = 31; // límite máximo

                if (diffDays > maxDays) {
                    Swal.fire({
                        title: 'Atención',
                        text: `No se puede seleccionar más de un mes para el reporte`,
                        icon: 'warning',
                        confirmButtonText: 'OK'
                    });

                    instance.setDate([selectedDates[0]], true);
                }
            }
        }
    });
});

// Función de filtrado por valores seleccionados
export async function attendanceReportFilter() {
    // Obtener valores de filtros
    const dayFilter = document.getElementById('date-report').value;
    const statusFilter = document.getElementById('status-report').value;

    let start = null;
    let end = null;

    if (dayFilter.includes(" a ")) {
        [start, end] = dayFilter.split(" a ");
    } else if (dayFilter) {
        start = dayFilter;
        end = dayFilter;
    } else {
        throw new Error('NO_DATE');
    }

    // Obtener registros filtrados por fecha
    allAttendances = await getRangeAttendances(start, end);
    allAbsences = await getRangeAbsences(start, end);
    const activeStaff = await getActiveStaffRange(start, end);
    // Agrupar los registros de asistencia por empleado con sus horas de checado
    const fullAttendances = await getCalendarEvents(activeStaff, allAttendances, allAbsences);

    // Filtrar el nuevo arreglo por tipo
    const filtered = fullAttendances.filter(a => {
        if (statusFilter === 'Total') return true;
        if (statusFilter === 'Ausencias') {
            return a.tipo_dia == "Falta";
        }
        if (statusFilter === 'Presentes') {
            return a.tipo_dia == "Laborado";
        }
        if (statusFilter === 'Retardos') {
            return a.tipo_dia === "Laborado" && a.detalle === "Retardo";
        }
        if (statusFilter === 'Permisos') {
            return a.tipo_dia == "Permiso" || a.tipo_dia == "Vacaciones";
        }

        return true;
    });

    return filtered;
}

// Función para crear el gráfico por departamentos
export function renderAttendanceGraphic(fullAttendances) {
    const container = document.getElementById("report-container");
    container.innerHTML = "";

    if (!fullAttendances.length) {
        container.innerHTML = `<div class="alert alert-info">No hay datos para mostrar</div>`;
        return;
    }

    // Agrupar por tipo de evento
    function getStatus(a) {
        if (a.tipo_dia == "Falta") return 'Ausencias';
        if (a.tipo_dia == "Permiso" || a.tipo_dia == "Vacaciones") return 'Permisos';

        if (a.entrada && a.variacion_entrada) {
            const match = a.variacion_entrada.match(/([+-])(\d{2}):(\d{2})/);

            if (match) {
                const sign = match[1];
                const minutes = parseInt(match[2]) * 60 + parseInt(match[3]);

                if (sign === '+' && minutes > 2) {
                    return 'Retardos';
                }
            }
        }

        return 'Asistencias';
    }

    // Agrupar por día
    const groupedByDay = {};

    fullAttendances.forEach(a => {
        const date = new Date(a.fecha).toISOString().split('T')[0];

        if (!groupedByDay[date]) {
            groupedByDay[date] = {
                Asistencias: 0,
                Retardos: 0,
                Ausencias: 0,
                Permisos: 0
            };
        }

        const status = getStatus(a);
        groupedByDay[date][status]++;
    });

    const labels = Object.keys(groupedByDay).sort();

    const asistencias = labels.map(d => groupedByDay[d].Asistencias);
    const retardos = labels.map(d => groupedByDay[d].Retardos);
    const ausencias = labels.map(d => groupedByDay[d].Ausencias);
    const permisos = labels.map(d => groupedByDay[d].Permisos);

    // Crear canvas para insertar el gráfico
    container.innerHTML = '<canvas id="attendance-graphic"></canvas>';
    const ctx = document.getElementById('attendance-graphic').getContext('2d');

    // Registrar plugin
    Chart.register(ChartDataLabels);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'Asistencias',
                    data: asistencias,
                    backgroundColor: '#bee493a8',
                    borderColor: '#809963',
                    borderWidth: 2,
                    borderRadius: 10
                },
                {
                    label: 'Retardos',
                    data: retardos,
                    backgroundColor: '#f7de92a8',
                    borderColor: '#ad9d67',
                    borderWidth: 2,
                    borderRadius: 10
                },
                {
                    label: 'Ausencias',
                    data: ausencias,
                    backgroundColor: '#fa839dad',
                    borderColor: '#a05767',
                    borderWidth: 2,
                    borderRadius: 10
                },
                {
                    label: 'Permisos',
                    data: permisos,
                    backgroundColor: '#83d4faad',
                    borderColor: '#578ba0',
                    borderWidth: 2,
                    borderRadius: 10
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            },
            plugins: {
                datalabels: {
                    anchor: 'center',
                    align: 'center',
                    color: '#000',
                    formatter: value => value
                }
            }
        }
    });
}

export async function attendanceReport(event) {
    event.preventDefault();

    const btn = event.target.closest('#btn-generate');

    try {
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = 'Generando...';
        }

        const filtered = await attendanceReportFilter();

        renderAttendanceGraphic(filtered);

    } catch (error) {
        if (error.message === 'NO_DATE') {
            Swal.fire({
                title: 'Atención',
                text: 'Seleccione al menos una fecha para generar el reporte.',
                icon: 'warning'
            });
        } else {
            console.error(error);
        }
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = 'Generar';
        }
    }
}