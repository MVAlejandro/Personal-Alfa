
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('vacations-form');

    container.innerHTML = 
        `<div id="vacations-form-container" class="container pt-4 pb-3 collapse">
            <div class="row pb-3">
                <div class="col d-flex align-items-center">
                    <div class="ms-4 me-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-suitcase-lg" viewBox="0 0 16 16">
                            <path d="M5 2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2h3.5A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5H14a.5.5 0 0 1-1 0H3a.5.5 0 0 1-1 0h-.5A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2zm1 0h4a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1M1.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5H3V3zM15 12.5v-9a.5.5 0 0 0-.5-.5H13v10h1.5a.5.5 0 0 0 .5-.5m-3 .5V3H4v10z"/>
                        </svg>
                    </div>
                    <h5>Nueva Solicitud de Vacaciones</h5>
                </div>
            </div>
            <form id="form-vacations">
                <div class="row ms-2 me-2 pt-3 pb-3">
                    <div class="col-md-4 label-over-border">
                        <label for="staff" class="form-label m-2">Empleado</label>
                        <select id="staff" class="form-select" aria-label="Default select example">
                            <option value="0">Seleccione...</option>

                        </select>
                        <p class="error invalid-feedback" id="error-staff" style="color: red;"></p>
                    </div>
                    <div class="col-md-3 label-over-border">
                        <label for="vacation-dates" class="form-label m-2">Periodo</label>
                        <input type="text" id="vacation-dates" class="form-control" placeholder="Periodo a tomar">
                        <p class="error invalid-feedback" id="error-vacation-dates" style="color: red;"></p>
                    </div>
                    <div class="col-md-5 label-over-border">
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

    const vacationsContainer = document.getElementById('vacations-form-container');

    // Crear instancia única de Collapse
    const collapseInstance = new bootstrap.Collapse(vacationsContainer, { toggle: false });

    document.getElementById('btn-add-vacations').addEventListener('click', () => {
        collapseInstance.show();
    });

    document.getElementById('btn-cancel').addEventListener('click', () => {
        collapseInstance.hide();
    });

    flatpickr("#vacation-dates", {
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