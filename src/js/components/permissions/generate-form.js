// Servicios Supabase
import { getActiveStaff } from "../../services/staff-service";
// Utilidades
import { loadOptionsFilter } from "../../utils/load-select";

document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById('permissions-form');

    container.innerHTML = 
        `<div id="permissions-form-container" class="container pt-4 pb-3 collapse">
            <div class="row pb-3">
                <div class="col d-flex align-items-center">
                    <div class="ms-4 me-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-clipboard2-minus" viewBox="0 0 16 16">
                            <path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5z"/>
                            <path d="M3 2.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 0 0-1h-.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1H12a.5.5 0 0 0 0 1h.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5z"/>
                            <path d="M6 8a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1z"/>
                        </svg>
                    </div>
                    <h5>Nuevo Permiso de Ausencia</h5>
                </div>
            </div>
            <form id="form-permissions">
                <div class="row ms-2 me-2 pt-3 pb-3">
                    <div class="col-3 label-over-border">
                        <label for="staff" class="form-label m-2">Empleado</label>
                        <select id="staff" class="form-select" aria-label="Default select example">
                            <option value="0">Seleccione...</option>

                        </select>
                        <p class="error invalid-feedback" id="error-staff" style="color: red;"></p>
                    </div>
                    <div class="col-md-3 col-lg-2 label-over-border">
                        <label for="type" class="form-label m-2">Tipo Permiso</label>
                        <select id="type" class="form-select" aria-label="Default select example">
                            <option value="0">Seleccione...</option>
                            <option value="Permiso">Permiso</option>
                            <option value="Vacaciones">Vacaciones</option>
                            <option value="Incapacidad">Incapacidad</option>
                            <option value="Falta">Falta</option>
                        </select>
                        <p class="error invalid-feedback" id="error-type" style="color: red;"></p>
                    </div>
                    <div class="col-3 label-over-border">
                        <label for="permission-dates" class="form-label m-2">Periodo</label>
                        <input type="text" id="permission-dates" class="form-control" placeholder="Periodo a tomar">
                        <p class="error invalid-feedback" id="error-permission-dates" style="color: red;"></p>
                    </div>
                    <div class="col-md-3 col-lg-4 label-over-border">
                        <label for="observations" class="form-label m-2">Observaciones</label>
                        <input type="text" id="observations" class="form-control" placeholder="Observaciones adicionales">
                        <p class="error invalid-feedback" id="error-observations" style="color: red;"></p>
                    </div>
                </div>
                <div class="d-flex align-items-center justify-content-end pt-1 me-3">
                    <button id="btn-cancel" type="button" class="btn btn-secondary d-flex align-items-center ps-3 pe-3 me-2">Cancelar</button>
                    <button id="btn-add" type="button" class="btn btn-primary d-flex align-items-center ps-3 pe-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy pe-1" viewBox="0 0 16 16">
                            <path d="M11 2H9v3h2z"/>
                            <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
                        </svg>
                        <p class="ps-2">Agregar</p>
                    </button>
                </div>
            </form>
        </div>`;

    // Cargar los empleados en el formulario
    await loadOptionsFilter('staff', getActiveStaff, 'nombre', 'id_empleado', 'Seleccione...')

    const permissionsContainer = document.getElementById('permissions-form-container');

    // Crear instancia única de Collapse
    const collapseInstance = new bootstrap.Collapse(permissionsContainer, { toggle: false });
    const form = document.getElementById('form-permissions');

    document.getElementById('btn-add-permission').addEventListener('click', () => {
        collapseInstance.show();
    });

    document.getElementById('btn-cancel').addEventListener('click', () => {
        collapseInstance.hide();
        form.reset();
        form.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
            e.classList.remove('is-valid', 'is-invalid');
        });
    });

    flatpickr("#permission-dates", {
        locale: {
            ...flatpickr.l10ns.es,
            firstDayOfWeek: 0
        },
        mode: "multiple",
        dateFormat: "Y-m-d",
        disable: [
            date => date.getDay() === 0 || date.getDay() === 6
        ]
    });
});