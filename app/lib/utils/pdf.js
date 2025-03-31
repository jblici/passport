import jsPDF from "jspdf";
import { formatDate, formatNumberWithDots, formatReglas, stringDate } from "./extras";
import { calcularDiferenciaDiasProducto, calcularTotalPersonas } from "./hoteles";

export const generatePDF = (
  paquetesSeleccionados,
  totalPesos,
  totalDolares,
  busqueda,
  imageData,
  clientName
) => {
  // Group packages by section (if needed)
  const paquetesPorSeccion = paquetesSeleccionados.reduce((grupos, paquete) => {
    if (!grupos[paquete.seccion]) {
      grupos[paquete.seccion] = [];
    }
    grupos[paquete.seccion].push(paquete);
    return grupos;
  }, {});

  // Optional ordering of sections (alojamiento first)
  const seccionesOrdenadas = Object.entries(paquetesPorSeccion).sort(([seccionA], [seccionB]) => {
    if (seccionA === "alojamiento") return -1;
    if (seccionB === "alojamiento") return 1;
    return 0;
  });

  seccionesOrdenadas.forEach(([seccion, paquetes]) => {
    console.log(`Sección: ${seccion}`);
    paquetes.forEach((paquete) => {
      console.log(`- Paquete: ${paquete.name}, Precio: ${paquete.price}`);
    });
  });

  let personas;
  if (busqueda.detalleHabitaciones) {
    personas = calcularTotalPersonas(busqueda.detalleHabitaciones);
  }

  const diasViaje = calcularDiferenciaDiasProducto(busqueda.producto);
  const fechasFormateadas = formatDate(busqueda.startDate, diasViaje);

  // Buffer drawing instructions in an array.
  const instructions = [];
  let currentY = 0; // Y-coordinate tracker

  // --- Header Instructions ---
  // Add the image (logo)
  instructions.push((doc) => {
    let img = new Image();
    img.height = 40;
    img.width = 40;
    img.src = imageData.src;
    doc.addImage(img, "png", 10, 10);
  });

  // Add client name if provided (adjust coordinate as needed)
  if (clientName) {
    instructions.push((doc) => {
      doc.text(`Cliente: ${clientName}`, 250, 20);
    });
  }

  // Title and Date
  instructions.push((doc) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(`Presupuesto Passport Ski ${new Date().getFullYear()}`, 10, 90);
  });
  instructions.push((doc) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text(`Fecha del presupuesto: ${obtenerFechaActual()}`, 14, 110);
  });

  // --- Add Trip Summary Right After Header ---
  // Place the summary right under "Fecha del presupuesto" (e.g., at y = 120)
  currentY = 120;
  if (personas) {
    instructions.push((doc) => {
      doc.setFontSize(12);
      doc.text(
        `${personas.total} Personas - Fechas del viaje: ${stringDate(busqueda.startDate)} - ${
          busqueda.endDate ? stringDate(busqueda.endDate) : fechasFormateadas.fechaFinal
        }`,
        14,
        currentY
      );
    });
    currentY += 20; // Increase Y for next content
  } else {
    // If no trip summary is needed, start packages a bit lower
    currentY += 20;
  }

  // --- Package Instructions ---
  paquetesSeleccionados.forEach((paquete) => {
    if (paquete.seccion === "alojamiento") {
      let descripcion = formatReglas(paquete.reglas);
      let textoPaquete = `• ${paquete.name}: $${formatNumberWithDots(paquete.price)} - ${paquete.noches} noches`;

      // Add the hotel package title
      const yPaquete = currentY;
      instructions.push((doc) => {
        doc.setFontSize(12);
        doc.text(textoPaquete, 17, yPaquete);
      });

      // Add the hotel description (wrapped text)
      const yDescripcion = currentY + 10;
      instructions.push((doc) => {
        doc.setFontSize(8);
        // Adjust maxWidth to fit within the page margins (e.g., 170 for a 210mm wide page)
        const maxWidth = 170;
        const splittedText = doc.splitTextToSize(descripcion, maxWidth);
        doc.text(splittedText, 20, yDescripcion);
      });

      currentY += 40; // Increase Y for next content

    } else if (paquete.seccion === "transporte") {
      const yPaquete = currentY;
      instructions.push((doc) => {
        doc.setFontSize(12);
        doc.text(`• ${paquete.name}: $${formatNumberWithDots(paquete.price)}`, 22, yPaquete);
      });

      const yFechas = currentY + 10;
      instructions.push((doc) => {
        doc.setFontSize(10);
        let fechas = paquete.clave
          ? paquete.clave === "ida"
            ? "Fecha: " + paquete.fechaInicio
            : "Fecha: " + paquete.fechaFin
          : "Fechas: " + paquete.fechaInicio + " - " + paquete.fechaFin;
        doc.text(fechas, 20, yFechas);
      });

      currentY += 20;
    } else {
      // For other sections, simply add the package line.
      const yPaquete = currentY;
      instructions.push((doc) => {
        const maxWidth = 170;
        const splittedText = doc.splitTextToSize(
          `• ${paquete.name}: $${formatNumberWithDots(paquete.price)}`,
          maxWidth
        );
        doc.setFontSize(12);
        doc.text(splittedText, 17, yPaquete);
      });
      currentY += 20;
    }
  });

  // --- Final Summary Instructions (Totals) ---
  currentY += 30;
  const finalY = currentY;
  instructions.push((doc) => {
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    if (totalDolares === 0) {
      doc.text(`Total: $${formatNumberWithDots(totalPesos)}`, 14, finalY);
    } else {
      doc.text(
        `Total ARS: $${formatNumberWithDots(totalPesos)} | Total USD: $${formatNumberWithDots(totalDolares)}`,
        14,
        finalY
      );
    }
  });

  instructions.push((doc) => {
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("El precio está sujeto a variación dependiendo de la fecha de pago.", 14, finalY + 10);
  });

  // Calculate custom height (add extra bottom margin)
  const customHeight = finalY + 30;

  // --- Create the PDF with custom dimensions ---
  const pdfDoc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [210, customHeight]
  });

  // Replay all buffered drawing instructions
  instructions.forEach((draw) => draw(pdfDoc));

  pdfDoc.setProperties({ title: "Passport-Presupuesto" });
  pdfDoc.getCurrentPageInfo("Passport-Presupuesto");
  pdfDoc.save("Passport-Presupuesto.pdf");
  pdfDoc.output("dataurlnewwindow");
};

function obtenerFechaActual() {
  const hoy = new Date();
  const dia = String(hoy.getDate()).padStart(2, "0");
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const anio = hoy.getFullYear();
  return `${dia}/${mes}/${anio}`;
}
