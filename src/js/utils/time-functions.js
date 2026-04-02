// Servicios Supabase
import { findSchedule } from "../services/schedule-service";

// Función para separar el formato de tiempo en día y hora
export function splitDateTime(fechaTexto) {
    const [date, hour] = fechaTexto.trim().split(' ');
    const [day, month, year] = date.split('/');
    return { date: `${year}-${month}-${day}`, hour };
}

// Función para obtener el día de la semana
export function getWeekDay(date) {
    const dias = [ 'domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado' ];
    const [day, month, year] = date.split('-').map(Number);
    const fecha = new Date(year, month - 1, day);

    return dias[fecha.getDay()];
}

// Función para darle formato al día de la semana
export function formatWeekDay(day) {
    const dias = {
        lunes: 'Lunes',
        martes: 'Martes',
        miercoles: 'Miércoles',
        jueves: 'Jueves',
        viernes: 'Viernes',
        sabado: 'Sábado',
        domingo: 'Domingo'
    };

    return dias[day] || null;
}

// Función auxiliar para convertir horas en minutos
export function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

// Función auxiliar para convertir minutos en horas
export function minutesToTime(mins) {
    const sign = mins < 0 ? '-' : '+';
    const hours = Math.floor(Math.abs(mins) / 60);
    const minutes = Math.abs(mins) % 60;

    return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

// Función para determinar el tipo de registro de asistencia basado en el horario del empleado
export async function determinateType(id, day, time) {
    const schedule = await findSchedule(id, day);

    if (!schedule) return null;

    const current = timeToMinutes(time);
    const entrance = timeToMinutes(schedule.entrada);
    const exit = timeToMinutes(schedule.salida);

    const margin = 3 * 60; // 3 horas en minutos

    // Rango de entrada
    const entranceMin = entrance - margin;
    const entranceMax = entrance + margin;

    // Rango de salida
    const exitMin = exit - margin;
    const exitMax = exit + margin;

    if (current >= entranceMin && current <= entranceMax) {
        return "Entrada";
    }

    if (current >= exitMin && current <= exitMax) {
        return "Salida";
    }

    // Fuera de rango
    return null; 
}

// Funciones para obtener el color dependiendo la variación de tiempo
export function entryColor(data) {
    if (data[0] == "+") {
        return 'red';
    } else if (data[0] == '-') {
        return 'green';
    } else {
        return 'black';
    }
}

export function exitColor(data) {
    if (data[0] == "-") {
        return 'red';
    } else if (data[0] == '+') {
        return 'green';
    } else {
        return 'black';
    }
}
