import supabase from '../../supabase/supabase-client.js'
// Servicios Supabase
import { getStaff } from '../../services/staff-service.js';

let allStaff = [];

// Función para crear la lista de empleados
export async function renderStaffList(staffParam = null) {
    if (staffParam) {
        allStaff = staffParam;
    } else {
        allStaff = await getStaff();
    }

    // Ordenar el arreglo completo antes de paginar
    allStaff.sort((a, b) => a.id_empleado - b.id_empleado);

    const container = document.getElementById('staff-list');
    // Limpiar lista antes de insertar
    container.innerHTML = '';

    if (!allStaff || allStaff.length === 0) {
        container.innerHTML = `<p>No hay registros que mostrar.</p>`;
        return;
    }

    allStaff.forEach(staff => {
        container.innerHTML += 
        `<button type="button" class="list-group-item list-group-item-action" staff-data='${JSON.stringify(staff)}'>
            <div class="employee">
                <p class="staff-name">${staff.nombre}</p>
                <p class="staff-id">Num Empleado: ${staff.numero_empleado}</p>
            </div>
        </button>`;
    });
}