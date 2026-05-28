// Servicios Supabase
import { findStaff } from "../../services/staff-service.js";
import { findExtraTime } from "../../services/extra-time-service.js";

export async function extraTimeReport(idStaff) {
    let dataForExcel = [];

    // Determinar la información del reporte a generar
    const staffData = await findStaff(idStaff);
    const allExtraTimes = await findExtraTime(idStaff);
    dataForExcel = allExtraTimes.map(r => ({
        "No. Empleado": r.numero_empleado, 
        "Nombre": r.nombre,
        "Fecha": r.fecha,
        "Estado": r.estado, 
        "Observaciones": r.observaciones
    }));

    if (!dataForExcel.length) {
        Swal.fire({
            title: 'Atención',
            text: 'No hay datos para exportar.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return;
    }
    
    const ws = XLSX.utils.json_to_sheet(dataForExcel);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, `T Extra ${staffData.numero_empleado}`);
    XLSX.writeFile(wb, `reporte_Textra_${staffData.nombre}.xlsx`);

    return dataForExcel
}