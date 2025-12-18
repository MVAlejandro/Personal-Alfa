import supabase from '../../supabase/supabase-client.js'
// Servicios Supabase
import { updateStaff, deleteStaff } from '../../services/staff-service.js'; 
import { renderStaffList } from './staff-list.js'; 
// Utilidades
import { nameValidate, textValidate, curpValidate, rfcValidate, nssValidate, phoneValidate, idValidate, amountValidate, inputValidate, selectValidate, dateValidate } from '../../utils/form-validations.js';

// Función para cargar datos en el formulario
export async function renderStaffEditForm(staff) {
    // Insertar valores en los inputs
    document.getElementById("id-staff").value = staff.numero_empleado;
    document.getElementById("staff-name").value = staff.nombre;
    document.getElementById("staff-departament").value = staff.puesto;
    document.getElementById("staff-birth").value = staff.fecha_nacimiento;
    document.getElementById("staff-phone").value = staff.telefono;
    document.getElementById("staff-entry").value = staff.fecha_ingreso;
    document.getElementById("staff-nss").value = staff.nss;
    document.getElementById("staff-rfc").value = staff.rfc;
    document.getElementById("staff-curp").value = staff.curp;
    document.getElementById("staff-direction").value = staff.direccion;
    document.getElementById("staff-status").value = staff.estatus;
    document.getElementById("emergency-name").value = staff.nombre_emergencia;
    document.getElementById("emergency-relation").value = staff.parentesco_emergencia;
    document.getElementById("emergency-phone").value = staff.telefono_emergencia;
    document.getElementById("staff-btype").value = staff.tipo_sangre;
    document.getElementById("staff-illness").value = staff.enfermedad;
    document.getElementById("staff-medicament").value = staff.medicamento;
    document.getElementById("staff-allergy").value = staff.alergia;
    document.getElementById("staff-boots").value = staff.calzado;
    document.getElementById("staff-tshirt").value = staff.playera;
    document.getElementById("staff-shirt").value = staff.camisa;
    document.getElementById("staff-pants").value = staff.pantalon;
}