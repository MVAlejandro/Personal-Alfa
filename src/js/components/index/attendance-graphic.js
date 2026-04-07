// Servicios Supabase
import { getActiveStaff } from "../../services/staff-service";
import { getFormatedAttendances, getRangeAttendances } from "../../services/attendance-service"; 

// Función para crear el gráfico por departamentos
export async function renderStaffGraphic() {
    // Obtener todos los registros
    const allStaff = await getActiveStaff();

    const container = document.getElementById("graphic-staff-container");
    // Limpiar antes de insertar
    container.innerHTML = "";

    if (!allStaff.length) {
        container.innerHTML = `<div class="alert alert-info">No hay datos para mostrar</div>`;
        return;
    }

    // Agrupar tickets por departamento
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

    // Generar el gráfico con la información del reporte
    container.innerHTML = '<canvas id="departament-graphic"></canvas>';
    const ctx = document.getElementById('departament-graphic').getContext('2d');

    // Registrar el plugin si es necesario
    Chart.register(ChartDataLabels);

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                label: 'Empleados por departamento',
                data
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                datalabels: {
                    color: '#fff',
                    formatter: value => value
                }
            }
        },
        plugins: [ChartDataLabels]
    });
    
}

// Función para crear el gráfico por departamentos
export async function renderAttendanceGraphic(start, end) {
    // Obtener todos los registros
    const allAttendances = await getRangeAttendances(start, end);
    // Agrupar los registros de asistencia por empleado con sus horas de checado
    const fullAttendances = await getFormatedAttendances(allAttendances);

    const container = document.getElementById("graphic-attendance-container");
    // Limpiar antes de insertar
    container.innerHTML = "";

    if (!fullAttendances.length) {
        container.innerHTML = `<div class="alert alert-info">No hay datos para mostrar</div>`;
        return;
    }

    // Organizar por tipo de evento
    function getStatus(a) {
        if (!a.entrada && !a.salida) return 'Ausencias';

        if (a.entrada && a.variacion_entrada) {
            const match = a.variacion_entrada.match(/([+-])(\d{2}):(\d{2})/);

            if (match) {
                const sign = match[1];
                const minutes = parseInt(match[2]) * 60 + parseInt(match[3]);

                if (sign === '+' && minutes > 5) {
                    return 'Retardos';
                }
            }
        }

        return 'Asistencias';
    }

    // Inicializar contadores
    const counts = {
        Asistencias: 0,
        Retardos: 0,
        Ausencias: 0
    };

    fullAttendances.forEach(a => {
        const status = getStatus(a);
        counts[status]++;
    });

    const total = fullAttendances.length;

    // Calcular porcentajes
    const labels = Object.keys(counts);
    const data = labels.map(label => {
        return ((counts[label] / total) * 100).toFixed(2);
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
                data
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                datalabels: {
                    color: '#fff',
                    formatter: value => value + '%'
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}
