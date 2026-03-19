import { renderAttendanceReportTable, renderStaffReportTable, renderUniformsReportTable, renderVacationsReportTable } from "./report-table";

// Función de renderizado para personal
export async function generateStaffReport() {
    const filterContainer = document.getElementById('reports-filter-container');
    const reportContainer = document.getElementById('report-container');

    // Generar los filtros del reporte
    filterContainer.innerHTML = 
    `<div class="row ms-2 me-2">
        <div class="col-lg-3 col-md-4 d-flex align-items-center label-over-border">
            <label for="status-filter" class="form-label m-2">Filtrar por Estatus</label>
            <select class="form-select" id="status-filter">
                <option value="0">Todos</option>
                <option value="Activo">Activos</option>
                <option value="Inactivo">Inactivos</option>
            </select>
        </div>
        <div class="col-md d-flex align-items-center justify-content-end">
            <button id="filter-staff-btn" class="btn btn-primary d-flex align-items-center ps-3 pe-3 me-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                </svg>
                <p class="ps-2">Filtrar</p>
            </button>
            <button id="export-staff-btn" class="btn btn-primary d-flex align-items-center ps-3 pe-3 ms-2 me-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-table" viewBox="0 0 16 16">
                    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 2h-4v3h4zm0 4h-4v3h4zm0 4h-4v3h3a1 1 0 0 0 1-1zm-5 3v-3H6v3zm-5 0v-3H1v2a1 1 0 0 0 1 1zm-4-4h4V8H1zm0-4h4V4H1zm5-3v3h4V4zm4 4H6v3h4z"/>
                </svg>
                <p class="ps-2">Exportar</p>
            </button>
        </div>
    </div>`;

    // Generar la tabla del reporte
    reportContainer.innerHTML = 
    `<table id="staff-table" class="table table-hover align-middle">
        <thead>
            <tr class="table-light">
                <th class="p-2 ps-4">No</th>
                <th class="p-2">NOMBRE</th>
                <th class="p-2">PUESTO</th>
                <th class="text-center p-2">NACIMIENTO</th>
                <th class="text-center p-2">INGRESO</th>
                <th class="text-center p-2">RFC</th>
                <th class="text-center p-2">ESTATUS</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="text-center" colspan="5">No hay empleados registrados</td>
            </tr>
        </tbody>
    </table>`;

    renderStaffReportTable()
}

// Función de renderizado para asistencia
export async function generateAttendanceReport() {
    const filterContainer = document.getElementById('reports-filter-container');
    const reportContainer = document.getElementById('report-container');

    // Generar los filtros del reporte
    filterContainer.innerHTML = 
    `<div class="row ms-2 me-2">
        <div class="col-lg-3 col-md-4 d-flex align-items-center label-over-border">
            <label for="day-filter" class="form-label m-2">Filtrar por Día</label>
            <input type="text" id="day-filter" class="form-control" placeholder="Fecha a mostrar" autocomplete="off">
        </div>
        <div class="col-lg-3 col-md-4 d-flex align-items-center label-over-border">
            <label for="type-filter" class="form-label m-2">Filtrar por Tipo</label>
            <select class="form-select" id="type-filter">
                <option value="0">Todos</option>
                <option value="Presentes">Presentes</option>
                <option value="Retardos">Retardos</option>
                <option value="Faltas">Faltas</option>
            </select>
        </div>
        <div class="col-md d-flex align-items-center justify-content-end">
            <button id="filter-attendance-btn" class="btn btn-primary d-flex align-items-center ps-3 pe-3 me-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                </svg>
                <p class="ps-2">Filtrar</p>
            </button>
            <button id="export-attendance-btn" class="btn btn-primary d-flex align-items-center ps-3 pe-3 ms-2 me-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-table" viewBox="0 0 16 16">
                    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 2h-4v3h4zm0 4h-4v3h4zm0 4h-4v3h3a1 1 0 0 0 1-1zm-5 3v-3H6v3zm-5 0v-3H1v2a1 1 0 0 0 1 1zm-4-4h4V8H1zm0-4h4V4H1zm5-3v3h4V4zm4 4H6v3h4z"/>
                </svg>
                <p class="ps-2">Exportar</p>
            </button>
        </div>
    </div>`;

    // Generar la tabla del reporte
    reportContainer.innerHTML = 
    `<table id="attendance-table" class="table table-hover align-middle">
        <thead>
            <tr class="table-light">
                <th class="p-2 ps-4">No</th>
                <th class="p-2">NOMBRE</th>
                <th class="p-2 text-center">FECHA</th>
                <th class="p-2 text-center">ENTRADA</th>
                <th class="p-2 text-center">SALIDA</th>
                <th class="p-2 text-center">VERIFICACIÓN</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="text-center" colspan="6">No hay asistencias registradas</td>
            </tr>
        </tbody>
    </table>`;

    renderAttendanceReportTable();
}

// Función de renderizado para uniformes
export async function generateUniformsReport() {
    const filterContainer = document.getElementById('reports-filter-container');
    const reportContainer = document.getElementById('report-container');

    // Generar los filtros del reporte
    filterContainer.innerHTML = 
    `<div class="row ms-2 me-2">
        <div class="col-lg-3 col-md-4 d-flex align-items-center label-over-border">
            <label for="status-filter" class="form-label m-2">Filtrar por Estatus</label>
            <select class="form-select" id="status-filter">
                <option value="0">Todos</option>
                <option value="Completos">Completos</option>
                <option value="Incompletos">Incompletos</option>
            </select>
        </div>
        <div class="col-md d-flex align-items-center justify-content-end">
            <button id="filter-uniforms-btn" class="btn btn-primary d-flex align-items-center ps-3 pe-3 me-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                </svg>
                <p class="ps-2">Filtrar</p>
            </button>
            <button id="export-uniforms-btn" class="btn btn-primary d-flex align-items-center ps-3 pe-3 ms-2 me-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-table" viewBox="0 0 16 16">
                    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 2h-4v3h4zm0 4h-4v3h4zm0 4h-4v3h3a1 1 0 0 0 1-1zm-5 3v-3H6v3zm-5 0v-3H1v2a1 1 0 0 0 1 1zm-4-4h4V8H1zm0-4h4V4H1zm5-3v3h4V4zm4 4H6v3h4z"/>
                </svg>
                <p class="ps-2">Exportar</p>
            </button>
        </div>
    </div>`;

    // Generar la tabla del reporte
    reportContainer.innerHTML = 
    `<table id="uniforms-table" class="table table-hover align-middle">
        <thead>
            <tr class="table-light">
                <th class="p-2 ps-4">No</th>
                <th class="p-2">NOMBRE</th>
                <th class="text-center p-2">CALZADO</th>
                <th class="text-center p-2">PLAYERA</th>
                <th class="text-center p-2">CAMISA</th>
                <th class="text-center p-2">PANTALÓN</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="text-center" colspan="6">No hay entregas registradas</td>
            </tr>
        </tbody>
    </table>`;

    renderUniformsReportTable();
}

// Función de renderizado para vacaciones
export async function generateVacationsReport() {
    const filterContainer = document.getElementById('reports-filter-container');
    const reportContainer = document.getElementById('report-container');

    // Generar los filtros del reporte
    filterContainer.innerHTML = 
    `<div class="row ms-2 me-2">
        <div class="col-lg-3 col-md-4 d-flex align-items-center label-over-border">
            <label for="status-filter" class="form-label m-2">Filtrar por Días</label>
            <select class="form-select" id="status-filter">
                <option value="0">Todos</option>
                <option value="Disponibles">Disponibles</option>
                <option value="Completos">Completos</option>
            </select>
        </div>
        <div class="col-md d-flex align-items-center justify-content-end">
            <button id="filter-vacations-btn" class="btn btn-primary d-flex align-items-center ps-3 pe-3 me-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                </svg>
                <p class="ps-2">Filtrar</p>
            </button>
            <button id="export-vacations-btn" class="btn btn-primary d-flex align-items-center ps-3 pe-3 ms-2 me-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-table" viewBox="0 0 16 16">
                    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 2h-4v3h4zm0 4h-4v3h4zm0 4h-4v3h3a1 1 0 0 0 1-1zm-5 3v-3H6v3zm-5 0v-3H1v2a1 1 0 0 0 1 1zm-4-4h4V8H1zm0-4h4V4H1zm5-3v3h4V4zm4 4H6v3h4z"/>
                </svg>
                <p class="ps-2">Exportar</p>
            </button>
        </div>
    </div>`;

    // Generar la tabla del reporte
    reportContainer.innerHTML = 
    `<table id="vacations-table" class="table table-hover align-middle">
        <thead>
            <tr class="table-light">
                <th class="p-2 ps-4">No</th>
                <th class="p-2">NOMBRE</th>
                <th class="p-2">INGRESO</th>
                <th class="text-center p-2">TOTAL</th>
                <th class="text-center p-2">TOMADOS</th>
                <th class="text-center p-2">RESTANTES</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="text-center" colspan="6">No hay registros de vacaciones</td>
            </tr>
        </tbody>
    </table>`;

    renderVacationsReportTable();
}