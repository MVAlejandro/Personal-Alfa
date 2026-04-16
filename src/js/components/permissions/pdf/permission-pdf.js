
export async function permissionPDF(solicitud) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ format: 'letter' });

    // Función para trazar un rectángulo
    // punto inicial = {x,y}, ancho(px) = {w}, alto(px) = {h} y grosor de línea = {m}
    function drawRect (x, y, w, h, m) {
        doc.setDrawColor(0);
        doc.setLineWidth(m); 
        doc.rect(x, y, w, h); 
    }

    // Función para generar texto con posición centrada en su contenedor
    // texto = {txt}, ancho del contenedor = {cont} y altura a colocar = {y}
    function textCenter (txt, cont, y) {
        const textWidth = doc.getStringUnitWidth(txt) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        const x = (cont / 2) - (textWidth / 2);
        doc.text(txt, x, y);
    }

    // Margen guía exterior
    // drawRect(10, 10, (215.9 - 2 * 10), (279.4 - 2 * 10), 0.1);

    // DOCUMENTO PDF //
    // Margen encabezado
    drawRect(10, 10, 196, 20, 0.1);
    drawRect(10, 10, 39.2, 20, 0.1);
    drawRect(10, 22, 39.2, 8, 0.1);
    drawRect(49.2, 22, 39.2, 8, 0.1);
    drawRect(88.4, 22, 39.2, 8, 0.1);
    drawRect(127.6, 22, 39.2, 8, 0.1);
    drawRect(166.8, 22, 39.2, 8, 0.1);
    // Imagen 
    doc.addImage('./assets/images/logo-color-png-396x324.png', 'PNG', 23, 11, 13, 10);

    // Encabezado centrado
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    textCenter(`SOLICITUD DE AUSENCIA TEMPORAL`, 254, 18);

    // Datos clave
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    textCenter("CLAVE", 59, 25);
    textCenter("REVISIÓN", 138, 25);
    textCenter("FECHA REV", 216, 25);
    textCenter("VIGENCIA", 295, 25);
    textCenter("PÁGINA", 372, 25);

    doc.setFont("helvetica", "normal");
    textCenter("RH-FR-012", 59, 28.5);
    textCenter("02", 138, 28.5);
    textCenter("MARZO 2026", 216, 28.5);
    textCenter("MARZO 2028", 295, 28.5);
    textCenter("1 DE 1", 372, 28.5);

    // Contenido
    // Insertar información del solicitante
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(`FECHA:`, 151.5, 49); // 3.5+
    doc.setFont("helvetica", "normal");
    doc.text(`${solicitud.fecha_solicitud}`, 172, 49);

    doc.setFont("helvetica", "bold");
    doc.text(`DATOS DEL COLABORADOR`, 10, 64.5);

    doc.setFont("helvetica", "italic");
    doc.text(`NOMBRE COMPLETO:`, 10, 75);
    doc.setFont("helvetica", "normal");
    doc.text(`${solicitud.nombre}`, 55, 75);
    doc.setFont("helvetica", "italic");
    doc.text(`FIRMA:`, 145, 75);
    doc.setFont("helvetica", "normal");
    doc.text("_____________________", 164, 75);

    doc.setFont("helvetica", "italic");
    doc.text(`PUESTO:`, 10, 85.5);
    doc.setFont("helvetica", "normal");
    doc.text(`${solicitud.puesto}`, 33, 85.5);
    doc.setFont("helvetica", "italic");
    doc.text(`ÁREA:`, 110, 85.5);
    doc.setFont("helvetica", "normal");
    doc.text(`${solicitud.puesto}`, 129, 85.5);

    doc.setFont("helvetica", "italic");
    doc.text(`ENCARGADO DE ÁREA:`, 10, 96);
    doc.setFont("helvetica", "normal");
    doc.text("___________________________________________________________________________", 58.1, 96);

    doc.setFont("helvetica", "bold");
    doc.text(`DETALLES DE LA SOLICITUD`, 10, 106.5);
    doc.setFont("helvetica", "italic");
    doc.text(`TIPO:`, 151.5, 106.5);
    doc.setFont("helvetica", "normal");
    doc.text(`${solicitud.tipo}`, 168, 106.5);

    doc.setFont("helvetica", "italic");
    doc.text(`FECHAS DEL PERMISO:`, 10, 117);
    doc.setFont("helvetica", "normal");
    doc.text(`${solicitud.fechas_solicitadas}`, 56, 117,{ maxWidth: 140 });

    doc.setFont("helvetica", "italic");
    doc.text(`SALIDA:`, 20, 131.5);
    doc.setFont("helvetica", "normal");
    doc.text("_____________________", 42, 131.5);
    doc.setFont("helvetica", "italic");
    doc.text(`REINCORPORACIÓN:`, 110, 131.5);
    doc.setFont("helvetica", "normal");
    doc.text("_____________________", 153, 131.5);

    doc.setFont("helvetica", "italic");
    doc.text(`DESCRIPCIÓN DEL PERMISO:`, 10, 142);
    doc.setFont("helvetica", "normal");
    doc.text(`${solicitud.observaciones}`, 69, 142,{ maxWidth: 128 });

    doc.setFont("helvetica", "italic");
    doc.text(`TIPO DE PERMISO:`, 10, 156.5);
    doc.setFont("helvetica", "normal");
    drawRect(90, 153.5, 3.5, 3.5, 0.1);
    doc.text(`Laboral`, 98, 156.5);
    drawRect(140, 153.5, 3.5, 3.5, 0.1);
    doc.text(`Personal`, 148, 156.5);
    
    drawRect(10, 167, (215.9 - 2 * 10), 0.4, 0.1);

    doc.setFont("helvetica", "bold");
    doc.text(`PARA USO DE RECURSOS HUMANOS O DIRECCIÓN`, 10, 177.5);

    doc.setFont("helvetica", "italic");
    doc.text(`EN CASO DE USO PERSONAL:`, 10, 188);
    doc.setFont("helvetica", "normal");
    drawRect(90, 185, 3.5, 3.5, 0.1);
    doc.text(`Aprobado`, 98, 188);
    drawRect(140, 185, 3.5, 3.5, 0.1);
    doc.text(`No Aprobado`, 148, 188);

    doc.setFont("helvetica", "italic");
    doc.text(`EN CASO DE SER APROBADO:`, 10, 198.5);
    doc.setFont("helvetica", "normal");
    drawRect(90, 195.5, 3.5, 3.5, 0.1);
    doc.text(`Remunerado`, 98, 198.5);
    drawRect(140, 195.5, 3.5, 3.5, 0.1);
    doc.text(`No Remunerado`, 148, 198.5);

    doc.setFont("helvetica", "italic");
    doc.text(`¿SE ENTREGA JUSTIFICANTE?`, 10, 209);
    doc.setFont("helvetica", "normal");
    drawRect(90, 206, 3.5, 3.5, 0.1);
    doc.text(`Sí`, 98, 209);
    drawRect(140, 206, 3.5, 3.5, 0.1);
    doc.text(`No`, 148, 209);

    doc.setFont("helvetica", "bold");
    textCenter("NOTA: TODO PERMISO DEBE SOLICITARSE CON UNA ANTICIPACION MINIMA DE 48 HORAS.", 216, 224.5);

    // Tabla firmas
    doc.setFont("helvetica", "normal");
    textCenter("_________________________", 85, 250);
    textCenter("Firma del Coordinador", 85, 255);

    textCenter("_________________________", 215, 250);
    textCenter("Firma del Jefe Directo", 215, 255);

    textCenter("_________________________", 346, 250);
    textCenter("Recursos Humanos", 346, 255);

    return doc;
}
