// Servicios Supabase
import { getUniformsDeliver } from "../../services/uniforms-deliver-service";
import { getUniformsResume } from "../../services/uniforms-service";

export async function uniformsReport() {
    // Obtener tipo de reporte por el radio seleccionado
    let dataForExcel = [];
    const reportType = document.querySelector('input[name="report-select"]:checked')?.value;
    const resultsText = document.getElementById('uniforms-results');

    // Determinar la información del reporte a generar
    if (reportType === 'Historial') {
        const allDelivers = await getUniformsDeliver();
        dataForExcel = allDelivers.map(r => ({
            "No. Empleado": r.numero_empleado, 
            "Nombre": r.nombre, 
            "Puesto": r.puesto,
            "Tipo": r.tipo_entrega, 
            "Prenda": r.tipo_prenda, 
            "Talla": r.talla,
            "Cantidad": r.cantidad, 
            "F Entrega": r.fecha_entrega, 
            "Observaciones": r.observaciones
        }));

        const ws = XLSX.utils.json_to_sheet(dataForExcel);
        const wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, `Entregas`);
        XLSX.writeFile(wb, `rep_entregas_uniformes_${new Date().toISOString().split('T')[0]}.xlsx`);
    }
        
    if (reportType === 'Registro') {
        const today = new Date().toISOString().split("T")[0];
        const allUniforms = await getUniformsResume(today);
        dataForExcel = allUniforms.map(r => ({
            "No. Empleado": r.numero_empleado, 
            "Nombre": r.nombre, 
            "Puesto": r.puesto,
            ...r.prendas
        }));

        const ws = XLSX.utils.json_to_sheet(dataForExcel);
        const wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, `Uniformes`);
        XLSX.writeFile(wb, `rep_uniformes_${new Date().toISOString().split('T')[0]}.xlsx`);
        
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