// Utilidades
import { nameValidate, textValidate, curpValidate, rfcValidate, nssValidate, phoneValidate, idValidate, amountValidate, inputValidate, selectValidate, dateValidate } from '../../utils/form-validations.js';

export function validateForm() {
    const form = document.getElementById('staff-form');
    // Referencias para validación
    const numero_empleadoIn = document.getElementById("id-staff");
    const nombreIn = document.getElementById("staff-name");
    const puestoIn = document.getElementById("staff-departament");
    const fecha_nacimientoIn = document.getElementById("staff-birth");
    const telefonoIn = document.getElementById("staff-phone");
    const fecha_ingresoIn = document.getElementById("staff-entry");
    const nssIn = document.getElementById("staff-nss");
    const rfcIn = document.getElementById("staff-rfc");
    const curpIn = document.getElementById("staff-curp");
    const direccionIn = document.getElementById("staff-direction");
    const estatusIn = document.getElementById("staff-status");
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
    const puestoError = document.getElementById("error-staff-departament");
    const fecha_nacimientoError = document.getElementById("error-staff-birth");
    const telefonoError = document.getElementById("error-staff-phone");
    const fecha_ingresoError = document.getElementById("error-staff-entry");
    const nssError = document.getElementById("error-staff-nss");
    const rfcError = document.getElementById("error-staff-rfc");
    const curpError = document.getElementById("error-staff-curp");
    const direccionError = document.getElementById("error-staff-direction");
    const estatusError = document.getElementById("error-staff-status");
    const nombre_emergenciaError = document.getElementById("error-emergency-name");
    const parentesco_emergenciaError = document.getElementById("error-emergency-relation");
    const telefono_emergenciaError = document.getElementById("error-emergency-phone");
    const calzadoError = document.getElementById("error-staff-boots");
    const playeraError = document.getElementById("error-staff-tshirt");
    const camisaError = document.getElementById("error-staff-shirt");
    const pantalonError = document.getElementById("error-staff-pants");

    // Validaciones
    idValidate(numero_empleadoIn, numero_empleadoError)
    nameValidate(nombreIn, nombreError)
    textValidate(puestoIn, puestoError)
    dateValidate(fecha_nacimientoIn, fecha_nacimientoError)
    phoneValidate(telefonoIn, telefonoError)
    dateValidate(fecha_ingresoIn, fecha_ingresoError)
    nssValidate(nssIn, nssError)
    rfcValidate(rfcIn, rfcError)
    curpValidate(curpIn, curpError)
    textValidate(direccionIn, direccionError)
    selectValidate(estatusIn, estatusError)
    nameValidate(nombre_emergenciaIn, nombre_emergenciaError)
    textValidate(parentesco_emergenciaIn, parentesco_emergenciaError)
    phoneValidate(telefono_emergenciaIn, telefono_emergenciaError)
    amountValidate(calzadoIn, calzadoError)
    textValidate(playeraIn, playeraError)
    textValidate(camisaIn, camisaError)
    amountValidate(pantalonIn, pantalonError)
    
    const campos = form.querySelectorAll('input, select')

    if (!inputValidate(campos)) {
        return null;
    }

    // Guardar valores
    return {
        numero_empleado: numero_empleadoIn.value,
        nombre: nombreIn.value,
        puesto: puestoIn.value,
        fecha_nacimiento: fecha_nacimientoIn.value,
        telefono: telefonoIn.value,
        fecha_ingreso: fecha_ingresoIn.value,
        nss: nssIn.value,
        rfc: rfcIn.value,
        curp: curpIn.value,
        direccion: direccionIn.value,
        estatus: estatusIn.value,
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