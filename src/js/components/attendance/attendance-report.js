// Servicios Supabase
import { getFormatedAttendances, getRangeAttendances } from '../../services/attendance-service.js'; 

let allAttendances = [];

document.addEventListener('DOMContentLoaded', () => { 
    flatpickr("#date-report", {
        locale: {
            ...flatpickr.l10ns.es,
            firstDayOfWeek: 0
        },
        mode: "range",
        dateFormat: "Y-m-d",
        defaultDate: new Date(),
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
                    // Borra la selección
                    instance.setDate(new Date(), true); 
                }
            }
        }
    });
});

// Función de filtrado por valores seleccionados
export async function attendanceReportFilter() {
    // Obtener valores de filtros
    const dayFilterEl = document.getElementById('date-report');
    const statusFilterEl = document.getElementById('status-report');

    const dayFilter = dayFilterEl?.value || "";
    const [start, end] = dayFilter.split(" a ");
    
    const statusFilter = statusFilterEl?.value || '0';

    // Obtener registros filtrados por fecha
    allAttendances = await getRangeAttendances(start, end);
    // Agrupar los registros de asistencia por empleado con sus horas de checado
    const fullAttendances = await getFormatedAttendances(allAttendances);

    // Filtrar el nuevo arreglo por tipo
    const filtered = fullAttendances.filter(a => {
        if (statusFilter === 'Total') return true;
        if (statusFilter === 'Ausencias') {
            return !a.entrada && !a.salida;
        }
        if (statusFilter === 'Presentes') {
            return !!a.entrada || !!a.salida;
        }
        if (statusFilter === 'Retardos') {
        if (!a.entrada || !a.variacion_entrada) return false;
            // Extraer los minutos positivos de variacion_entrada
            const match = a.variacion_entrada.match(/([+-])(\d{2}):(\d{2})/);
            if (!match) return false;

            const sign = match[1]; // + o -
            const hours = parseInt(match[2], 10);
            const minutes = parseInt(match[3], 10);

            const totalMinutes = hours * 60 + minutes;

            // Retardo: solo positivos y más de 5 minutos
            return sign === '+' && totalMinutes > 5;
        }

        return true;
    });
    
    return filtered;
}