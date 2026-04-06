// Servicios Supabase
import { getPermission } from "../../services/permissions-service"; 
import { getVacationsResume } from "../../services/absences-service"; 

export async function absencesReport() {
    // Obtener tipo de reporte por el radio seleccionado
    let dataForExcel = [];
    const reportType = document.querySelector('input[name="report-select"]:checked')?.value;
    const resultsText = document.getElementById('permissions-results');

    // Determinar la información del reporte a generar
    if (reportType === 'Permisos') {
        const allPermissions = await getPermission();
        dataForExcel = allPermissions.map(r => ({
            "No. Empleado": r.numero_empleado, 
            "Nombre": r.nombre, 
            "Puesto": r.puesto,
            "Tipo": r.tipo,
            "F Solicitud": r.fecha_solicitud, 
            "Fechas": r.fechas_solicitadas,
            "Estado": r.estado, 
            "Observaciones": r.observaciones
        }));

        const ws = XLSX.utils.json_to_sheet(dataForExcel);
        const wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, `Permisos`);
        XLSX.writeFile(wb, `reporte_permisos_${new Date().toISOString().split('T')[0]}.xlsx`);
    }
        
    if (reportType === 'Vacaciones') {
        const allVacations = await getVacationsResume();
        console.log(allVacations);
        
        dataForExcel = allVacations.map(r => ({
            "No. Empleado": r.numero_empleado, 
            "Nombre": r.nombre, 
            "Puesto": r.puesto,
            "F Ingreso": r.fecha_ingreso,
            "Antigüedad": r.antiguedad,
            "Total": r.dias_total,
            "Tomados": r.dias_tomados,
            "Pendientes": r.dias_pendientes,
            "Fechas tomadas": (r.fechas_tomadas || []).join(', ')
        }));

        const ws = XLSX.utils.json_to_sheet(dataForExcel);
        const wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, `Vacaciones`);
        XLSX.writeFile(wb, `rep_vacaciones_${new Date().toISOString().split('T')[0]}.xlsx`);
    }
    
    if (!dataForExcel.length) {
        Swal.fire({
            title: 'Atención',
            text: 'No hay datos para exportar.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return;
    }

    resultsText.textContent = `${dataForExcel.length} Registros generados`;

    return dataForExcel
}