
// Expresiones regulares para validación de datos
const idRegex = /^\d+$/ // Id de empleado
const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/; // Nombres y el apellidos
const textRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,()\/\-–— +]+$/; // Texto con algunos caracteres especiales
const curpRegex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/; // CURP
const rfcRegex = /^([A-Z&Ñ]{3,4})\d{6}[A-Z0-9]{3}$/; // RFC
const nssRegex = /^\d{11}$/; // NSS
const phoneRegex = /^[1-9]\d{9}$/; // Número telefónico
const amountRegex = /^\d+([-\.]\d{1,2})?$/ // Cantidades y precios
const passRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,()\/\-–—_!@#$%^&*+=?:;'"{}[\]<>\|~`]+$/; // Contraseñas con signos comunes

// Función que valida que los campos sean solo letras, algunos caracteres especiales y que haya al menos 2 caracteres
export function textValidate(input, error) {
    error.textContent = '';
    input.classList.remove('is-invalid', 'is-valid');

    if (input.value.length < 2) {
        error.textContent = `El campo debe de tener al menos 2 caracteres`;
        input.classList.add('is-invalid');
    } else if (!textRegex.test(input.value)) {
        error.textContent = `El campo no acepta esos caracteres especiales`;
        input.classList.add('is-invalid');
    } else {
        error.textContent = '';
        input.classList.add('is-valid');
    }
}

// Función que valida que los campos sean solo letras y que haya al menos 3 caracteres
export function nameValidate(input, error) {
    error.textContent = '';
    input.classList.remove('is-invalid', 'is-valid');

    if (input.value.length < 3) {
        error.textContent = `El campo debe de tener al menos 3 caracteres`;
        input.classList.add('is-invalid');
    } else if (!nameRegex.test(input.value)) {
        error.textContent = `El campo no acepta caracteres especiales ni números`;
        input.classList.add('is-invalid');
    } else {
        error.textContent = '';
        input.classList.add('is-valid');
    }
}

// Función que valida que la curp tenga un formato válido
export function curpValidate(input, error) {
    error.textContent = '';
    input.classList.remove('is-invalid', 'is-valid');

    if (!curpRegex.test(input.value)) {
        error.textContent=`La CURP debe de cumplir con el formato válido`;
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    } else {
        error.textContent = '';
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    }
}

// Función que valida que el rfc tenga un formato válido
export function rfcValidate(input, error) {
    error.textContent = '';
    input.classList.remove('is-invalid', 'is-valid');

    if (!rfcRegex.test(input.value)) {
        error.textContent=`El RFC debe de cumplir con el formato válido`;
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    } else {
        error.textContent = '';
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    }
}

// Función que valida que el nss tenga un formato válido
export  function nssValidate(input, error) {
    error.textContent = '';
    input.classList.remove('is-invalid', 'is-valid');

    if (!nssRegex.test(input.value)) {
        error.textContent=`El NSS debe de cumplir con el formato válido`;
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    } else {
        error.textContent = '';
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    }
}

// Función que valida que sea un número telefónico
export function phoneValidate(input, error) {
    error.textContent = '';
    input.classList.remove('is-invalid', 'is-valid');

    if (!phoneRegex.test(input.value.trim())) {
        error.textContent=`El número telefónico no es válido`;
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    } else {
        error.textContent = '';
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    }
}

// Función que valida que el código postal sea correcto
export function idValidate (input, error){
    error.textContent = '';
    input.classList.remove('is-invalid', 'is-valid');

    if(!idRegex.test(input.value)){
        error.textContent=`El ID no es válido`;
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    } else {
        error.textContent = '';
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    }
}

// Función que valida que el costo sea válido
export function amountValidate (input, error){
    error.textContent = '';
    input.classList.remove('is-invalid', 'is-valid');

    if(!amountRegex.test(input.value)){
        error.textContent=`El dato no es válido`;
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    } else {
        error.textContent = '';
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    }
}

// Función que valida los caracteres permitidos en contraseñas
export function passValidate(data, error) {
    error.textContent = '';
    data.classList.remove('is-invalid', 'is-valid');

    if (data.value.length < 3) {
        error.textContent = `El campo debe de tener al menos 3 caracteres`;
        data.classList.add('is-invalid');
    } else if (!passRegex.test(data.value)) {
        error.textContent=`La contraseña no puede incluir esos caracteres especiales`;
        data.classList.add('is-invalid');
        data.classList.remove('is-valid');
    } else {
        error.textContent = '';
        data.classList.remove('is-invalid');
        data.classList.add('is-valid');
    }
}

// Función que valida que los inputs no sean inválidos
export function inputValidate(campos) {
    for (let campo of campos) {
        if (campo.classList.contains('is-invalid')) {
        return false;
        }
    }
    return true;
} 

// Función que valida la selección de una opción en selects
export function selectValidate(selectElement, errorElement) {
    const valor = selectElement.value;

    if (valor === '0') {
        selectElement.classList.add('is-invalid');
        selectElement.classList.remove('is-valid');
        if (errorElement) {
            errorElement.textContent = 'Se debe seleccionar una opción';
        }
        return false;
    } else {
        selectElement.classList.remove('is-invalid');
        selectElement.classList.add('is-valid');
        if (errorElement) {
            errorElement.textContent = '';
        }
        return true;
    }
}

// Función que valida los inputs de fechas
export function dateValidate(data, error) {
    error.textContent = '';
    data.classList.remove('is-invalid', 'is-valid');

    if (data.value === "") {
        error.textContent = `Debe seleccionar una fecha valida`;
        data.classList.add('is-invalid');
    } else {
        error.textContent = '';
        data.classList.remove('is-invalid');
        data.classList.add('is-valid');
    }
}