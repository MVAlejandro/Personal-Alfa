// Servicios Supabase
import { getActiveStaff } from "../../services/staff-service";
import { getAttendances } from "../../services/attendance-service"; 
import { getCalendarEvents } from "../../services/calendar-service";
import { getAbsences } from "../../services/absences-service";

// Función para crear el gráfico por departamentos
export async function renderStaffGraphic(date) {
    // Obtener todos los registros
    const allStaff = await getActiveStaff(date);

    const container = document.getElementById("graphic-staff-container");
    // Limpiar antes de insertar
    container.innerHTML = "";

    if (!allStaff.length) {
        container.innerHTML = `<div class="alert alert-info">No hay datos para mostrar</div>`;
        return;
    }

    // Agrupar empleados por departamento
    const staffDepartaments = {};

    allStaff.forEach(staff => {
        const departament = staff.departamento;

        if (!staffDepartaments[departament]) {
            staffDepartaments[departament] = 0;
        }
        staffDepartaments[departament]++;
    });

    const labels = Object.keys(staffDepartaments);
    const data = Object.values(staffDepartaments);

    // Insertar canvas
    container.innerHTML = '<canvas id="departament-graphic"></canvas>';
    const ctx = document.getElementById('departament-graphic').getContext('2d');

    // Registrar plugin
    Chart.register(ChartDataLabels);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Empleados por departamento',
                data,
                backgroundColor: '#8FC74A'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
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
                    color: '#FFF',
                    formatter: value => value
                },
                legend: {
                    display: false
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

// Función para crear el gráfico de asistencias
export async function renderAttendanceGraphic(start, end, activeStaff) {
    // Obtener todos los registros
    const allAttendances = await getAttendances(start, end);
    const allAbsences = await getAbsences(start, end);
    // Agrupar los registros de asistencia por empleado con sus horas de checado
    const fullAttendances = await getCalendarEvents(activeStaff, allAttendances, allAbsences);

    const container = document.getElementById("graphic-attendance-container");
    // Limpiar antes de insertar
    container.innerHTML = "";

    if (!fullAttendances.length) {
        container.innerHTML = `<div class="alert alert-info">No hay datos para mostrar</div>`;
        return;
    }

    // Organizar por tipo de evento
    function getStatus(a) {
        if (a.tipo_dia === "Falta") {
            return 'Ausencias';
        }

        if (a.tipo_dia === "Permiso" || a.tipo_dia === "Vacaciones" || a.tipo_dia === "Descanso") {
            return 'Permisos';
        }

        if (a.tipo_dia === "Laborado" && a.detalle === "Retardo") {
            return 'Retardos';
        }

        if (a.tipo_dia === "Laborado") {
            return 'Asistencias';
        }

        return 'Asistencias';
    }

    // Inicializar contadores
    const counts = {
        Asistencias: 0,
        Retardos: 0,
        Ausencias: 0,
        Permisos: 0
    };

    fullAttendances.forEach(a => {
        const status = getStatus(a);
        counts[status]++;
    });

    const total = fullAttendances.length;

    // Calcular porcentajes
    const labels = Object.keys(counts);
    const data = labels.map(label => {
        return ((counts[label] / total) * 100).toFixed(1);
    });

    // Generar gráfico
    container.innerHTML = '<canvas id="attendance-graphic"></canvas>';
    const ctx = document.getElementById('attendance-graphic').getContext('2d');

    Chart.register(ChartDataLabels);

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                label: 'Porcentaje',
                data,
                backgroundColor: [
                    '#8FC74A',
                    '#f3b737',
                    '#f13b44',
                    '#358ff5'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                // Ocultar labels dentro del gráfico
                datalabels: {
                    display: false
                },
                legend: {
                    position: 'left',
                    labels: {
                        generateLabels(chart) {
                            const data = chart.data;
                            return data.labels.map((label, index) => {
                                const value = data.datasets[0].data[index];
                                return {
                                    text: `${label}: ${value}%`,
                                    fillStyle: data.datasets[0].backgroundColor[index],
                                    strokeStyle: data.datasets[0].backgroundColor[index],
                                    lineWidth: 1,
                                    hidden: false,
                                    index
                                };
                            });
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label;
                            // Cantidad real
                            const quantity = counts[label];
                            // Porcentaje
                            const percentage = context.raw;
                            return `${label}: ${quantity} (${percentage}%)`;
                        }
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}
