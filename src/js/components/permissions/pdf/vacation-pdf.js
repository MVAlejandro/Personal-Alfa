import { getVacationsResume } from "../../../services/vacations-service";

export async function vacationPDF(solicitud) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ format: 'letter' });

    const today = new Date().toISOString().split("T")[0]
    const allVacations = await getVacationsResume(today);
    const vacations = allVacations.find(v => v.id_empleado === solicitud.id_empleado) || { saldo: 0 };

    // Función para trazar un rectángulo
    // punto inicial = {x,y}, ancho(px) = {w}, alto(px) = {h} y grosor de línea = {m}
    function drawRect (x, y, w, h, m) {
        doc.setDrawColor(0);
        doc.setLineWidth(m); 
        doc.rect(x, y, w, h); 
    }

    // Función para trazar un rectángulo con color
    // punto inicial = {x,y}, ancho(px) = {w}, alto(px) = {h}, grosor de línea = {m} y color = {c}
    function drawColRect (x, y, w, h, m, c) {
        doc.setDrawColor(0);
        doc.setFillColor(c);
        doc.setLineWidth(m); 
        doc.rect(x, y, w, h, "DF"); 
    }

    // Función para generar texto con posición centrada en su contenedor
    // texto = {txt}, ancho del contenedor = {cont} y altura a colocar = {y}
    function textCenter (txt, cont, y) {
        const textWidth = doc.getStringUnitWidth(txt) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        const x = (cont / 2) - (textWidth / 2);
        doc.text(txt, x, y);
    }

    // Función reutilizable con las instrucciones para generar el documento
    // punto inicial de referencia en eje Y = {y}, leyenda para original y copia = {title}, datos de la solicitud = {solicitud} y registros de vacaciones = {vacations}
    function generatePDF(y, title, solicitud, vacations) {
        // Margen encabezado
        drawRect(10, y+10, 196, 20, 0.1);
        drawRect(10, y+10, 39.2, 20, 0.1);
        drawRect(10, y+22, 39.2, 8, 0.1);
        drawRect(49.2, y+22, 39.2, 8, 0.1);
        drawRect(88.4, y+22, 39.2, 8, 0.1);
        drawRect(127.6, y+22, 39.2, 8, 0.1);
        drawRect(166.8, y+22, 39.2, 8, 0.1);
        // Imagen 
        doc.addImage('./assets/images/logo-color-png-396x324.png', 'PNG', 23, y+11, 13, 10);

        // Encabezado centrado
        doc.setFontSize(15);
        doc.setFont("helvetica", "bold");
        textCenter(`SOLICITUD DE VACACIONES`, 254, y+18);

        // Datos clave
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        textCenter("CLAVE", 59, y+25);
        textCenter("REVISIÓN", 138, y+25);
        textCenter("FECHA REV", 216, y+25);
        textCenter("VIGENCIA", 295, y+25);
        textCenter("PÁGINA", 372, y+25);

        doc.setFont("helvetica", "normal");
        textCenter("RH-FR-010", 59, y+28.5);
        textCenter("06", 138, y+28.5);
        textCenter("MARZO 2026", 216, y+28.5);
        textCenter("MARZO 2028", 295, y+28.5);
        textCenter("1 DE 1", 372, y+28.5);

        // Margen contenido
        // drawRect(10, y+33, 196, 104, 0.1);

        // Contenido
        doc.setFont("helvetica", "bold");
        textCenter(title, 215.9, y+36);
        // Insertar información del solicitante
        drawColRect(140, y+33, 26.8, 5.5, 0.1, "#8FC74A");
        drawRect(140, y+33, 66, 5.5, 0.1);
        doc.setFont("helvetica", "bold");
        doc.text(`Núm empleado`, 144.5, y+37);
        doc.setFont("helvetica", "normal");
        doc.text(`${solicitud.numero_empleado}`, 172, y+37);

        drawColRect(140, y+41.5, 26.8, 5.5, 0.1, "#8FC74A");
        drawRect(140, y+41.5, 66, 5.5, 0.1);
        doc.setFont("helvetica", "bold");
        doc.text(`Fecha`, 156.5, y+45.5);
        doc.setFont("helvetica", "normal");
        doc.text(`${solicitud.fecha_solicitud}`, 172, y+45.5);

        drawColRect(10, y+53, 39.2, 8, 0.1, "#8FC74A");
        drawRect(10, y+61, 39.2, 10, 0.1);
        doc.setFont("helvetica", "bold");
        textCenter(`Días disponibles`, 59.2, y+58.5);
        doc.setFontSize(18);
        doc.setFont("helvetica", "normal");
        textCenter(`${vacations.saldo}`, 59.2, y+68);

        drawColRect(57, y+55, 31.5, 5.5, 0.1, "#8FC74A");
        drawRect(57, y+55, 83, 5.5, 0.1);
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.text(`Fecha de ingreso`, 63.5, y+59);
        doc.setFont("helvetica", "normal");
        doc.text(`${solicitud.fecha_ingreso}`, 94, y+59);

        drawColRect(57, y+63.5, 31.5, 5.5, 0.1, "#8FC74A");
        drawRect(57, y+63.5, 110, 5.5, 0.1);
        doc.setFont("helvetica", "bold");
        doc.text(`Nombre colaborador`, 58.8, y+67.5);
        doc.setFont("helvetica", "normal");
        doc.text(`${solicitud.nombre}`, 94, y+67.5);

        // Tabla días
        drawColRect(30, y+77, 20, 5.5, 0.1, "#8FC74A");
        drawRect(30, y+82.5, 20, 14.5, 0.1);
        doc.setFont("helvetica", "bold");
        textCenter("Días", 80, y+81);
        doc.setFontSize(18);
        doc.setFont("helvetica", "normal");
        textCenter(`${(solicitud.fechas_solicitadas.split(",").length) || ""}`, 80, y+92);

        // Tabla fechas
        drawColRect(57, y+77, 149, 5.5, 0.1, "#8FC74A");
        drawRect(57, y+82.5, 149, 14.5, 0.1);
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        textCenter("Fechas", 263, y+81);
        doc.setFont("helvetica", "normal");
        doc.text(`${solicitud.fechas_solicitadas}`, 63, y+89,{ maxWidth: 140 });

        // Tabla pendientes
        drawColRect(10, y+103, 20, 8, 0.1, "#8FC74A");
        drawRect(10, y+103, 39.2, 8, 0.1);
        doc.setFont("helvetica", "bold");
        textCenter("Días", 40, y+106.5);
        textCenter("restantes", 40, y+110);
        doc.setFontSize(12);
        textCenter(`${vacations.saldo - (solicitud.fechas_solicitadas.split(",").length)}`, 80, y+108.7);

        // Tabla firmas
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        textCenter("_____________________", 149, y+120);
        textCenter("Firma del colaborador", 149, y+125);

        textCenter("_____________________", 226, y+120);
        textCenter("Firma del jefe inmediato", 226, y+125);

        textCenter("_____________________", 303, y+120);
        textCenter("Dirección", 303, y+125);

        textCenter("_____________________", 379, y+120);
        textCenter("Recursos Humanos", 379, y+125);
    }

    // Mitad
    drawRect(0, 0, 215.9, (279.4 / 2), 0.1);
    // Margen guía superior
    // drawRect(10, 10, (215.9 - 2 * 10), (279.4 / 2) - 15, 0.1);
    // Margen guía inferior
    // drawRect(10, 139.7 + 5, (215.9 - 2 * 10), (279.4 / 2) - 15, 0.1);

    // DOCUMENTO PDF //
    // ---------- Tabla ORIGINAL ---------- //
    generatePDF(0, "ORIGINAL", solicitud, vacations)
    // ---------- Tabla COPIA ---------- //
    generatePDF(134.7, "COPIA", solicitud, vacations)

    return doc;
}
