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
            <button id="filter-btn" class="btn btn-primary d-flex align-items-center ps-3 pe-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                </svg>
                <p class="ps-2">Filtrar</p>
            </button>
        </div>
    </div>`;

    // Generar la tabla del reporte
    reportContainer.innerHTML = 
    `<table id="staff-table" class="table table-hover align-middle">
        <thead>
            <tr class="table-light">
                <th class="p-2 text-center">NÚM EMP</th>
                <th class="p-2">NOMBRE</th>
                <th class="p-2">PUESTO</th>
                <th class="p-2">INGRESO</th>
                <th class="p-2">ESTATUS</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="text-center" colspan="8">No hay empleados registrados</td>
            </tr>
        </tbody>
    </table>`;
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
            <button id="filter-btn" class="btn btn-primary d-flex align-items-center ps-3 pe-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                </svg>
                <p class="ps-2">Filtrar</p>
            </button>
        </div>
    </div>`;

    // Generar la tabla del reporte
    reportContainer.innerHTML = 
    `<table id="attendance-table" class="table table-hover align-middle">
        <thead>
            <tr class="table-light">
                <th class="p-2 text-center">NÚM EMP</th>
                <th class="p-2">NOMBRE</th>
                <th class="p-2 text-center">FECHA</th>
                <th class="p-2 text-center">ENTRADA</th>
                <th class="p-2 text-center">SALIDA</th>
                <th class="p-2 text-center">VERIFICACIÓN</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="text-center" colspan="8">No hay asistencias registradas</td>
            </tr>
        </tbody>
    </table>`;
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
            <button id="filter-btn" class="btn btn-primary d-flex align-items-center ps-3 pe-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                </svg>
                <p class="ps-2">Filtrar</p>
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
                <th class="p-2">CALZADO</th>
                <th class="p-2">PLAYERA</th>
                <th class="p-2">CAMISA</th>
                <th class="p-2">PANTALÓN</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="text-center" colspan="8">No hay entregas registradas</td>
            </tr>
        </tbody>
    </table>`;
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
            <button id="filter-btn" class="btn btn-primary d-flex align-items-center ps-3 pe-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                </svg>
                <p class="ps-2">Filtrar</p>
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
                <th class="p-2">TOMADOS</th>
                <th class="p-2">RESTANTES</th>
                <th class="p-2">PENDIENTES</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="text-center" colspan="8">No hay registros de vacaciones</td>
            </tr>
        </tbody>
    </table>`;
}