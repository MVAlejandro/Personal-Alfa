// Estilos generales
import '../../css/style.css'
import '../../css/pages/staff.css'

// Estilos de componentes
import '../../css/components/navbar.css'
import '../../css/components/footer.css'

// Componentes JS
import '../components/navbar.js';
import { generateForm, restoreForm } from '../components/staff/generate-form.js';

// Servicios Supabase
import { initPage, validateUserRole } from '../utils/session-validate.js';
import { addStaff } from '../components/staff/staff-add.js';
import { authorizeStaff, editStaff } from '../components/staff/staff-edit.js';
import { removeStaff } from '../components/staff/staff-remove.js';
import { staffFilter } from '../components/staff/staff-filter.js';
import { renderStaffEditForm } from '../components/staff/staff-edit.js';
import { findStaff } from '../services/staff-service.js';

let register = []

document.addEventListener('DOMContentLoaded', async () => {
    await initPage()
    register = await staffFilter();
});

// Declarar el botón de filtrado
document.addEventListener('click', async function(e) {
    if (e.target.id === 'filter-btn' || e.target.closest('#filter-btn')) {
        register = await staffFilter();
    }
});

// Declarar los botones para manipulación del formulario
document.getElementById("btn-add-staff").addEventListener("click", async () => {
    await generateForm()
});

document.addEventListener("click", (e) => {
    if (e.target.id === "btn-cancel-entry") {
        restoreForm();
    }
});

// Declarar el botón para mandar el formulario
document.addEventListener('click', function(e) {
    if (e.target.id === 'btn-add-entry') {
        addStaff(e);
    }
});

// Llenar formulario con información del empleado
const container = document.getElementById('staff-list');
container.addEventListener('click', async function(e) {
    // Obtener el id del empleado del botón
    const button = e.target.closest('button[staff-id]');
    if (!button) return;
    const staffId = JSON.parse(button.getAttribute('staff-id'));
    // Bajar la información del empleado encontrado con su id
    const staffData = await findStaff(staffId)
    
    await generateForm();
    await renderStaffEditForm(staffData);
});

// Declarar el botón de edición del empleado
document.addEventListener('click', function(e) {
    if (e.target.id === 'btn-update-entry') {
        editStaff(e);
    }
});

// Declarar el botón de aceptar el alta del empleado
document.addEventListener('click', function(e) {
    if (e.target.id === 'btn-authorize-entry') {
        authorizeStaff(e);
    }
});

// Declarar el botón de eliminación del empleado
document.addEventListener('click', function(e) {
    if (e.target.id === 'btn-remove-staff') {
        removeStaff(e);
    }
});

// Declarar el botón de exportación a Excel
document.getElementById("export-btn").addEventListener('click', async function() {
    if (!register.length) {
        Swal.fire({
            title: 'Atención',
            text: 'No hay datos para exportar.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return;
    }

    const dataForExcel = register.map(r => ({
        "No. Empleado": r.numero_empleado, "Nombre": r.nombre, "Puesto": r.puesto,
        "Estatus": r.estatus, "F Ingreso": r.fecha_ingreso, "F Baja": r.fecha_baja,
        "F Nacimiento": r.fecha_nacimiento, "NSS": r.nss, "RFC": r.rfc,
        "CURP": r.curp, "Télefono": r.telefono, "T Sangre": r.tipo_sangre,
        "Enfermedad": r.enfermedad, "Medicamento": r.medicamento, "Alergia": r.alergia,
        "Calzado": r.calzado, "Playera": r.playera, "Camisa": r.camisa, "Pantalón": r.pantalon
    }));

    const ws = XLSX.utils.json_to_sheet(dataForExcel);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, `Kardex`);
    XLSX.writeFile(wb, `reporte_empleados_${new Date().toISOString().split('T')[0]}.xlsx`);
});
