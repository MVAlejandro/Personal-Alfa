
export async function generateForm() {
    const container = document.getElementById('staff-info');

    container.innerHTML =
        `<div id="staff-info-container" class="container">
            <div class="pt-3 pb-3">
                <h5 class="ps-2">Información del Empleado</h5>
            </div>
            <form id="staff-form" class="pb-4">
                
                <div class="row ms-2 me-2 pb-1">
                    <div class="col-md-3">
                        <label for="id-staff" class="form-label fw-semibold m-2">No Empleado</label>
                        <input type="text" class="form-control" id="id-staff" placeholder="0000">
                        <p class="error invalid-feedback" id="error-id-staff" style="color: red;"></p>
                    </div>
                </div>
                <p class="staff-title ms-4 fst-italic">Datos generales</p>
                <div class="row ms-2 me-2">
                    <div class="col-md-8">
                        <label for="staff-name" class="form-label fw-semibold m-2">Nombre</label>
                        <input type="text" class="form-control" id="staff-name" placeholder="Nombre y Apellidos">
                        <p class="error invalid-feedback" id="error-staff-name" style="color: red;"></p>
                    </div>
                    <div class="col-md-4">
                        <label for="staff-departament" class="form-label fw-semibold m-2">Puesto</label>
                        <input type="text" class="form-control" id="staff-departament" placeholder="Puesto / Departamento">
                        <p class="error invalid-feedback" id="error-staff-departament" style="color: red;"></p>
                    </div>
                </div>
                <div class="row ms-2 me-2">
                    <div class="col-md-4">
                        <label for="staff-birth" class="form-label fw-semibold m-2">Fecha nacimiento</label>
                        <input type="date" class="form-control" id="staff-birth" required>
                        <p class="error invalid-feedback" id="error-staff-birth" style="color: red;"></p>
                    </div>
                    <div class="col-md-4">
                        <label for="staff-phone" class="form-label fw-semibold m-2">Teléfono</label>
                        <input type="number" class="form-control no-arrows" id="staff-phone" placeholder="5510203040">
                        <p class="error invalid-feedback" id="error-staff-phone" style="color: red;"></p>
                    </div>
                    <div class="col-md-4">
                        <label for="staff-entry" class="form-label fw-semibold m-2">Fecha ingreso</label>
                        <input type="date" class="form-control" id="staff-entry" required>
                        <p class="error invalid-feedback" id="error-staff-entry" style="color: red;"></p>
                    </div>
                </div>
                <div class="row ms-2 me-2">
                    <div class="col-md-3">
                        <label for="staff-nss" class="form-label fw-semibold m-2">NSS</label>
                        <input type="number" class="form-control no-arrows" id="staff-nss" placeholder="01234567891">
                        <p class="error invalid-feedback" id="error-staff-nss" style="color: red;"></p>
                    </div>
                    <div class="col-md-3">
                        <label for="staff-rfc" class="form-label fw-semibold m-2">RFC</label>
                        <input type="text" class="form-control" id="staff-rfc" placeholder="RFCX000000YY">
                        <p class="error invalid-feedback" id="error-staff-rfc" style="color: red;"></p>
                    </div>
                    <div class="col-md-6">
                        <label for="staff-curp" class="form-label fw-semibold m-2">CURP</label>
                        <input type="text" class="form-control" id="staff-curp" placeholder="CURP000000AABBCC00">
                        <p class="error invalid-feedback" id="error-staff-curp" style="color: red;"></p>
                    </div>
                </div>
                <div class="row ms-2 me-2 pb-3">
                    <div class="col-md-8">
                        <label for="staff-direction" class="form-label fw-semibold m-2">Dirección</label>
                        <input type="text" class="form-control" id="staff-direction" placeholder="Dirección completa">
                        <p class="error invalid-feedback" id="error-staff-direction" style="color: red;"></p>
                    </div>
                    <div class="col-md-4">
                        <label for="staff-status" class="form-label fw-semibold m-2">Estatus</label>
                        <select id="staff-status" class="form-select" aria-label="Default select example">
                            <option value="0">Seleccione...</option>
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo </option>
                        </select>
                        <p class="error invalid-feedback" id="error-staff-status" style="color: red;"></p>
                    </div>
                </div>
                <p class="staff-title ms-4 fst-italic">Datos de emergencia</p>
                <div class="row ms-2 me-2 pb-3">
                    <div class="col-md-6">
                        <label for="emergency-name" class="form-label fw-semibold m-2">Nombre</label>
                        <input type="text" class="form-control" id="emergency-name" placeholder="Nombre del contacto">
                        <p class="error invalid-feedback" id="error-emergency-name" style="color: red;"></p>
                    </div>
                    <div class="col-md-3">
                        <label for="emergency-relation" class="form-label fw-semibold m-2">Parentesco</label>
                        <input type="text" class="form-control" id="emergency-relation" placeholder="Parentesco de la persona">
                        <p class="error invalid-feedback" id="error-emergency-relation" style="color: red;"></p>
                    </div>
                    <div class="col-md-3">
                        <label for="emergency-phone" class="form-label fw-semibold m-2">Teléfono</label>
                        <input type="number" class="form-control no-arrows" id="emergency-phone" placeholder="Teléfono de emergencia">
                        <p class="error invalid-feedback" id="error-emergency-phone" style="color: red;"></p>
                    </div>
                </div>
                <p class="staff-title ms-4 fst-italic">Datos de salud</p>
                <div class="row ms-2 me-2 pb-3">
                    <div class="col-md-3">
                        <label for="staff-btype" class="form-label fw-semibold m-2">Tipo sangre</label>
                        <input type="text" class="form-control" id="staff-btype" placeholder="(Opcional)">
                        <p class="error invalid-feedback" id="error-staff-btype" style="color: red;"></p>
                    </div>
                    <div class="col-md-3">
                        <label for="staff-illness" class="form-label fw-semibold m-2">Enfermedad</label>
                        <input type="text" class="form-control" id="staff-illness" placeholder="(Opcional)">
                        <p class="error invalid-feedback" id="error-staff-illness" style="color: red;"></p>
                    </div>
                    <div class="col-md-3">
                        <label for="staff-medicament" class="form-label fw-semibold m-2">Medicamento</label>
                        <input type="text" class="form-control" id="staff-medicament" placeholder="(Opcional)">
                        <p class="error invalid-feedback" id="error-staff-medicament" style="color: red;"></p>
                    </div>
                    <div class="col-md-3">
                        <label for="staff-allergy" class="form-label fw-semibold m-2">Alergia</label>
                        <input type="text" class="form-control" id="staff-allergy" placeholder="(Opcional)">
                        <p class="error invalid-feedback" id="error-staff-allergy" style="color: red;"></p>
                    </div>
                </div>
                <p class="staff-title ms-4 fst-italic">Datos de uniforme</p>
                <div class="row ms-2 me-2">
                    <div class="col-md-3">
                        <label for="staff-boots" class="form-label fw-semibold m-2">Calzado</label>
                        <input type="number" class="form-control no-arrows" id="staff-boots" placeholder="Talla de calzado">
                        <p class="error invalid-feedback" id="error-staff-boots" style="color: red;"></p>
                    </div>
                    <div class="col-md-3">
                        <label for="staff-tshirt" class="form-label fw-semibold m-2">Playera</label>
                        <input type="text" class="form-control" id="staff-tshirt" placeholder="Talla de playera">
                        <p class="error invalid-feedback" id="error-staff-tshirt" style="color: red;"></p>
                    </div>
                    <div class="col-md-3">
                        <label for="staff-shirt" class="form-label fw-semibold m-2">Camisa</label>
                        <input type="text" class="form-control" id="staff-shirt" placeholder="Talla de camisa">
                        <p class="error invalid-feedback" id="error-staff-shirt" style="color: red;"></p>
                    </div>
                    <div class="col-md-3">
                        <label for="staff-pants" class="form-label fw-semibold m-2">Pantalón</label>
                        <input type="number" class="form-control no-arrows" id="staff-pants" placeholder="Talla de pantalón">
                        <p class="error invalid-feedback" id="error-staff-pants" style="color: red;"></p>
                    </div>
                </div>
            </form>
            <div class="form-buttons d-flex justify-content-end pb-4 me-3">
                <button id="btn-cancel-entry" class="btn btn-secondary m-1">Cancelar</button>
                <button id="btn-add-entry" class="btn btn-primary m-1">Añadir Empleado</button>
            </div>
        </div>`;
}
// <button class="btn btn-danger m-1" data-bs-target="#delete-modal" data-bs-toggle="modal">Eliminar registro</button>

export async function restoreForm() {
    const container = document.getElementById('staff-info');

    container.innerHTML =
        `<div id="staff-info-container" class="container d-flex justify-content-center align-items-center p-5">
            <div id="logo-info" class="text-center">
                <h5 class="fw-light mb-4">Seleccione un empleado para visualizar su información.</h5>
                <img src="/assets/images/logo-letras-420x187.png" alt="Logo Pallets Alfa" class="w-75 img-fluid">
            </div>
        </div>`;
}