
export async function generatePDF(ticket) {
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF({
        format: 'letter'
    });

    // Función para trazar un rectángulo
    // punto inicial = {x,y}, ancho(px) = {w}, alto(px) = {h} y grosor de línea = {m}
    function drawRect (x, y, w, h, m) {
        doc.setDrawColor(0);
        doc.setLineWidth(m); 
        doc.rect(x, y, w, h); 
    }

    // Función para generar texto con posición centrada en su contenedor
    // texto = {txt}, ancho del contenedor = {cont} y altura a colocar = [y]
    function textCenter (txt, cont, y) {
        const textWidth = doc.getStringUnitWidth(txt) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        const x = (cont / 2) - (textWidth / 2);
        doc.text(txt, x, y);
    }
    // Mitad
    // drawRect(0, 0, 215.9, (279.4 / 2), 0.1);
    // Margen guía superior
    // drawRect(10, 10, (215.9 - 2 * 10), (279.4 / 2) - 15, 0.1);
    // Margen guía inferior
    // drawRect(10, 139.7 + 5, (215.9 - 2 * 10), (279.4 / 2) - 15, 0.1);

    // DOCUMENTO PDF //
    // Tabla ORIGINAL //
    // Margen encabezado
    drawRect(10, 10, 196, 30, 0.1);
    drawRect(10, 10, 39.2, 30, 0.1);
    drawRect(10, 31, 39.2, 9, 0.1);
    drawRect(49.2, 31, 39.2, 9, 0.1);
    drawRect(88.4, 31, 39.2, 9, 0.1);
    drawRect(127.6, 31, 39.2, 9, 0.1);
    drawRect(166.8, 31, 39.2, 9, 0.1);
    // Imagen 
    doc.addImage('./assets/images/logo-color-png-396x324.png', 'PNG', 19, 13, 21, 15);

    // Encabezado centrado
    doc.setFontSize(15);
    textCenter("SOLICITUD DE VACACIONES", 254, 23);

    // Datos clave
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    textCenter("CLAVE", 59, 35);
    textCenter("REVISIÓN", 138, 35);
    textCenter("FECHA REV", 216, 35);
    textCenter("VIGENCIA", 295, 35);
    textCenter("PÁGINA", 372, 35);

    doc.setFont("helvetica", "normal");
    textCenter("RH-FR-017", 59, 39);
    textCenter("05", 138, 39);
    textCenter("JULIO 2025", 216, 39);
    textCenter("JULIO 2027", 295, 39);
    textCenter("1 DE 1", 372, 39);

    // Margen contenido
    // drawRect(10, 45, 196, 89.7, 0.1);

    // Contenido
    doc.setFont("helvetica", "bold");
    textCenter("ORIGINAL", 215.9, 50);
    // Insertar información del solicitante
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`Núm empleado:`, 130, 55);
    doc.setFont("helvetica", "normal");
    doc.text(`${ticket.numero_empleado}`, 158, 55);

    doc.setFont("helvetica", "bold");
    doc.text(`Fecha:`, 130, 60);
    doc.setFont("helvetica", "normal");
    doc.text(`${ticket.fecha_solicitud}`, 143, 60);

    doc.setFont("helvetica", "bold");
    doc.text(`Días pendientes por`, 20, 60);
    doc.text(`disfrutar`, 29.5, 65);
    doc.setFont("helvetica", "normal");
    doc.text(`___________________`, 18, 77);

    doc.setFont("helvetica", "bold");
    doc.text(`Fecha de ingreso:`, 70, 68);
    doc.setFont("helvetica", "normal");
    doc.text(`${ticket.fecha_ingreso}`, 110, 68);

    doc.setFont("helvetica", "bold");
    doc.text(`Nombre:`, 70, 73);
    doc.setFont("helvetica", "normal");
    doc.text(`${ticket.nombre}`, 110, 73);

    // Tabla días
    drawRect(34.5, 83, 20, 20, 0.1);
    drawRect(34.5, 83, 20, 5, 0.1);
    textCenter("Días", 89, 87);
    doc.setFontSize(18);
    textCenter(`${(ticket.fechas_solicitadas.split(",").length) || ""}`, 88.5, 98);

    // Tabla fechas
    drawRect(70, 83, 136, 20, 0.1);
    drawRect(70, 83, 136, 5, 0.1);
    doc.setFontSize(10);
    textCenter("Fechas", 276, 87);
    doc.text(`${ticket.fechas_solicitadas}`, 75, 94.5,{ maxWidth: 136 });

    // Tabla pendientes
    doc.setFontSize(8);
    drawRect(34.5, 108, 20, 20, 0.5);
    textCenter("Días pendientes", 44, 118);
    textCenter("por disfrutar", 44, 121);

    // Tabla firmas
    doc.setFontSize(10);
    textCenter("_________________________", 208, 122);
    textCenter("Firma del colaborador", 208, 127);

    textCenter("_________________________", 344, 122);
    textCenter("Firma del jefe inmediato", 344, 127);

    // Tabla COPIA // 134.7+
    // Margen encabezado
    drawRect(10, 144.7, 196, 30, 0.1);
    drawRect(10, 144.7, 39.2, 30, 0.1);
    drawRect(10, 165.7, 39.2, 9, 0.1);
    drawRect(49.2, 165.7, 39.2, 9, 0.1);
    drawRect(88.4, 165.7, 39.2, 9, 0.1);
    drawRect(127.6, 165.7, 39.2, 9, 0.1);
    drawRect(166.8, 165.7, 39.2, 9, 0.1);
    // Imagen 
    doc.addImage('./assets/images/logo-color-png-396x324.png', 'PNG', 19, 147.7, 21, 15);

    // Encabezado centrado
    doc.setFontSize(15);
    textCenter("SOLICITUD DE VACACIONES", 254, 157.7);

    // Datos clave
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    textCenter("CLAVE", 59, 169.5);
    textCenter("REVISIÓN", 138, 169.5);
    textCenter("FECHA REV", 216, 169.5);
    textCenter("VIGENCIA", 295, 169.5);
    textCenter("PÁGINA", 372, 169.5);

    doc.setFont("helvetica", "normal");
    textCenter("RH-FR-017", 59, 173.5);
    textCenter("05", 138, 173.5);
    textCenter("JULIO 2025", 216, 173.5);
    textCenter("JULIO 2027", 295, 173.5);
    textCenter("1 DE 1", 372, 173.5);

    // Margen contenido
    // drawRect(10, 179.7, 196, 89.7, 0.1);

    // Contenido
    doc.setFont("helvetica", "bold");
    textCenter("COPIA", 215.9, 184.7);
    // Insertar información del solicitante
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`Núm empleado:`, 130, 189.7);
    doc.setFont("helvetica", "normal");
    doc.text(`${ticket.numero_empleado}`, 158, 189.7);

    doc.setFont("helvetica", "bold");
    doc.text(`Fecha:`, 130, 194.7);
    doc.setFont("helvetica", "normal");
    doc.text(`${ticket.fecha_solicitud}`, 143, 194.7);

    doc.setFont("helvetica", "bold");
    doc.text(`Días pendientes por`, 20, 194.7);
    doc.text(`disfrutar`, 29.5, 199.7);
    doc.setFont("helvetica", "normal");
    doc.text(`___________________`, 18, 211.7);

    doc.setFont("helvetica", "bold");
    doc.text(`Fecha de ingreso:`, 70, 202.7);
    doc.setFont("helvetica", "normal");
    doc.text(`${ticket.fecha_ingreso}`, 110, 202.7);

    doc.setFont("helvetica", "bold");
    doc.text(`Nombre:`, 70, 207.7);
    doc.setFont("helvetica", "normal");
    doc.text(`${ticket.nombre}`, 110, 207.7);

    // Tabla días
    drawRect(34.5, 217.7, 20, 20, 0.1);
    drawRect(34.5, 217.7, 20, 5, 0.1);
    textCenter("Días", 89, 221.5);
    doc.setFontSize(18);
    textCenter(`${(ticket.fechas_solicitadas.split(",").length) || ""}`, 88.5, 232.7);

    // Tabla fechas
    drawRect(70, 217.7, 136, 20, 0.1);
    drawRect(70, 217.7, 136, 5, 0.1);
    doc.setFontSize(10);
    textCenter("Fechas", 276, 221.5);
    doc.text(`${ticket.fechas_solicitadas}`, 75, 229.2,{ maxWidth: 136 });

    // Tabla pendientes
    doc.setFontSize(8);
    drawRect(34.5, 242.7, 20, 20, 0.5);
    textCenter("Días pendientes", 44, 252.7);
    textCenter("por disfrutar", 44, 255.7);

    // Tabla firmas
    doc.setFontSize(10);
    textCenter("_________________________", 208, 256.7);
    textCenter("Firma del colaborador", 208, 261.7);

    textCenter("_________________________", 344, 256.7);
    textCenter("Firma del jefe inmediato", 344, 261.7);

    return doc;
}
