// Utilidades
import { nameValidate, textValidate, curpValidate, rfcValidate, nssValidate, phoneValidate, idValidate, inputValidate, selectValidate, dateValidate } from '../../utils/form-validations.js';

export function validateForm() {
    const form = document.getElementById('staff-form');
    // Referencias para validación
    const numero_empleadoIn = document.getElementById("id-staff");
    const nombreIn = document.getElementById("staff-name");
    const departamentoIn = document.getElementById("staff-departament");
    const puestoIn = document.getElementById("staff-position");
    const estatusIn = document.getElementById("staff-status");
    const fecha_ingresoIn = document.getElementById("staff-entry");
    const fecha_bajaIn = document.getElementById("staff-removed");
    const fecha_nacimientoIn = document.getElementById("staff-birth");
    const nssIn = document.getElementById("staff-nss");
    const rfcIn = document.getElementById("staff-rfc");
    const curpIn = document.getElementById("staff-curp");
    const telefonoIn = document.getElementById("staff-phone");
    const direccionIn = document.getElementById("staff-direction");
    const nombre_emergenciaIn = document.getElementById("emergency-name");
    const parentesco_emergenciaIn = document.getElementById("emergency-relation");
    const telefono_emergenciaIn = document.getElementById("emergency-phone");
    const tipo_sangreIn = document.getElementById("staff-btype");
    const enfermedadIn = document.getElementById("staff-illness");
    const medicamentoIn = document.getElementById("staff-medicament");
    const alergiaIn = document.getElementById("staff-allergy");
    const calzadoIn = document.getElementById("staff-boots");
    const playeraIn = document.getElementById("staff-tshirt");
    const camisaIn = document.getElementById("staff-shirt");
    const pantalonIn = document.getElementById("staff-pants");
    // Referencias para errores
    const numero_empleadoError = document.getElementById("error-id-staff");
    const nombreError = document.getElementById("error-staff-name");
    const departamentoError = document.getElementById("error-staff-departament");
    const puestoError = document.getElementById("error-staff-position");
    const estatusError = document.getElementById("error-staff-status");
    const fecha_ingresoError = document.getElementById("error-staff-entry");
    const fecha_nacimientoError = document.getElementById("error-staff-birth");
    const nssError = document.getElementById("error-staff-nss");
    const rfcError = document.getElementById("error-staff-rfc");
    const curpError = document.getElementById("error-staff-curp");
    const telefonoError = document.getElementById("error-staff-phone");
    const direccionError = document.getElementById("error-staff-direction");

    // Validaciones
    idValidate(numero_empleadoIn, numero_empleadoError)
    nameValidate(nombreIn, nombreError)
    selectValidate(departamentoIn, departamentoError)
    textValidate(puestoIn, puestoError)
    selectValidate(estatusIn, estatusError)
    dateValidate(fecha_ingresoIn, fecha_ingresoError)
    dateValidate(fecha_nacimientoIn, fecha_nacimientoError)
    nssValidate(nssIn, nssError)
    rfcValidate(rfcIn, rfcError)
    curpValidate(curpIn, curpError)
    phoneValidate(telefonoIn, telefonoError)
    textValidate(direccionIn, direccionError)
    
    const campos = form.querySelectorAll('input, select')

    if (!inputValidate(campos)) {
        return null;
    }

    // Guardar valores
    return {
        numero_empleado: numero_empleadoIn.value,
        nombre: nombreIn.value,
        id_departamento: departamentoIn.value,
        puesto: puestoIn.value,
        estatus: estatusIn.value,
        fecha_ingreso: fecha_ingresoIn.value,
        fecha_baja: fecha_bajaIn.value,
        fecha_nacimiento: fecha_nacimientoIn.value,
        nss: nssIn.value,
        rfc: rfcIn.value,
        curp: curpIn.value,
        telefono: telefonoIn.value,
        direccion: direccionIn.value,
        nombre_emergencia: nombre_emergenciaIn.value,
        parentesco_emergencia: parentesco_emergenciaIn.value,
        telefono_emergencia: telefono_emergenciaIn.value,
        tipo_sangre: tipo_sangreIn.value,
        enfermedad: enfermedadIn.value,
        medicamento: medicamentoIn.value,
        alergia: alergiaIn.value,
        calzado: calzadoIn.value,
        playera: playeraIn.value,
        camisa: camisaIn.value,
        pantalon: pantalonIn.value
    };
}