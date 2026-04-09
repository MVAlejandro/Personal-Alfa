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

    const container = document.getElementById('staff-list');
    // Limpiar lista antes de insertar
    container.innerHTML = '';

    if (!allStaff || allStaff.length === 0) {
        container.innerHTML = `<p>No hay registros que mostrar.</p>`;
        return;
    }

    allStaff.forEach(staff => {
        // Determinar el color del nombre en base a su estado
        let statusClass = '';
        if (staff.estatus == "Activo") {
            statusClass = 'black';
        } else if (staff.estatus == 'Inactivo') {
            statusClass = 'red';
        } else if (staff.estatus == 'Pendiente') {
            statusClass = 'grey';
        }

        container.innerHTML += 
        `<button type="button" class="list-group-item list-group-item-action" staff-id='${staff.id_empleado}'>
            <div class="employee">
                <p class="staff-name" style="color:${statusClass} !important">${staff.nombre}</p>
                <p class="staff-id">Num Empleado: ${staff.numero_empleado}</p>
            </div>
        </button>`;
    });
}