import jsPDF from "jspdf";
import {
  formatDate,
  formatNumberPercentage,
  formatNumberWithDots,
  formatReglas,
  stringDate,
} from "./extras";
import { calcularDiferenciaDiasProducto, calcularTotalPersonas } from "./hoteles";

export const generatePDF = (
  paquetesSeleccionados,
  totalPesos,
  totalDolares,
  busqueda,
  imageData,
  clientName,
  ocultarPrecios
) => {
  try {
    let totalHeight = 10; // Initial height (top margin)

    // --- Helper function to calculate height ---
    const calculateTextHeight = (text, fontSize, pageWidth, margin) => {
      const doc = new jsPDF(); // Use temporary doc for calculation
      doc.setFontSize(fontSize);
      const textLines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      return textLines.length * fontSize * 0.35 + 5; // Approximate line height
    };

    // --- Calculate Total Height ---
    totalHeight += 40; // Image height
    if (clientName) {
      totalHeight += 12;
    }
    totalHeight += 20; // Title
    totalHeight += 20; // Date
    if (busqueda.detalleHabitaciones) {
      totalHeight += 20;
    }

    paquetesSeleccionados.forEach((paquete) => {
      totalHeight += 12; // Package name
      if (paquete.seccion === "alojamiento") {
        totalHeight += calculateTextHeight(formatReglas(paquete.reglas), 8, 170, 20);
      } else if (paquete.seccion === "transporte") {
        totalHeight += 10; // Date
        totalHeight += 10;
      }
    });

    totalHeight += 20; // Totals
    totalHeight += 10; // Disclaimer

    // --- Initialize jsPDF with Calculated Height ---
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [210, totalHeight], // Add some bottom margin
    });

    const pageWidth = doc.internal.pageSize.getWidth() - 50;
    const margin = 10;
    let currentY = margin;

    // --- Helper function to add text ---
    const addText = (text, x, y, fontSize, fontStyle = "normal") => {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", fontStyle);
      const textLines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      textLines.forEach((line) => {
        doc.text(line, x, y);
        y += fontSize * 0.5; // Approximate line height
      });
      return y;
    };

    const addRow = (leftText, rightText, x, y, fontSize, discount) => {
      const margin = 10;
      doc.setFontSize(fontSize);
      const pageWidth = doc.internal.pageSize.getWidth();
      const textLines = doc.splitTextToSize(leftText, pageWidth - 4.2 * margin);

      doc.setFont("helvetica", "normal");

      // Texto a la izquierda
      textLines.forEach((line) => {
        doc.text(line, x, y);
        y += fontSize * 0.5; // Approximate line height
      });

      // Texto a la derecha (alineado desde la derecha hacia la izquierda)
      const textWidth = doc.getTextWidth(rightText);
      console.log(textWidth);
      doc.setFont("helvetica", "bold");
      if (textLines.length > 1) {
        doc.text(rightText, pageWidth - margin - textWidth, y - 12);
        if (discount) {
          doc.setFontSize(8);
          doc.setFont("helvetica", "italic");
          doc.setTextColor(150); // Gris
          doc.text(discount, pageWidth - 6, y - 6);
          doc.setTextColor(0); // Volver a negro
          doc.setFontSize(fontSize);
        }
      } else {
        doc.text(rightText, pageWidth - margin - textWidth, y - 6);
        if (discount) {
          doc.setFontSize(8);
          doc.setFont("helvetica", "italic");
          doc.setTextColor(150); // Gris
          doc.text(discount, pageWidth - margin - textWidth === 0 ? 16 : textWidth, y);
          doc.setTextColor(0); // Volver a negro
        }
      }

      return y;
    };

    // --- Add Content ---
    let img = new Image();
    img.height = 40;
    img.width = 40;
    img.src = imageData.src;
    doc.addImage(img, "png", margin, currentY);

    if (clientName) {
      currentY = addText(`Cliente: ${clientName}`, pageWidth, currentY + 10, 14, "bold");
    }
    currentY += 20;

    currentY = addText(
      `Presupuesto Passport Ski ${new Date().getFullYear()}`,
      margin,
      currentY,
      20,
      "bold"
    );
    currentY;

    currentY = addRow("Fecha del presupuesto", obtenerFechaActual(), margin, currentY, 12);
    currentY;

    if (busqueda.detalleHabitaciones) {
      currentY = addText(
        `${
          calcularTotalPersonas(busqueda.detalleHabitaciones).total
        } Personas - Fechas del viaje: ${stringDate(busqueda.startDate)} - ${
          busqueda.endDate
            ? stringDate(busqueda.endDate)
            : formatDate(busqueda.startDate, calcularDiferenciaDiasProducto(busqueda.producto))
                .fechaFinal
        }`,
        margin,
        currentY,
        12
      );
      currentY += 5;
    }

    //console.log(paquetesSeleccionados);
    paquetesSeleccionados.forEach((paquete) => {
      if (paquete.seccion === "alojamiento") {
        currentY = addRow(
          `• ${paquete.name}`,
          `${
            ocultarPrecios
              ? ""
              : paquete.discount > 0
              ? `$${formatNumberWithDots(paquete.price - paquete.discount)}`
              : `$${formatNumberWithDots(paquete.price)}`
          }`,
          10,
          currentY,
          12,

          ocultarPrecios
            ? ""
            : paquete.discount > 0
            ? `${formatNumberPercentage(paquete.discount, paquete.price)}% OFF ya aplicado`
            : null
        );
        currentY = addText(formatReglas(paquete.reglas), 12, currentY, 8);
        currentY += 5;
      } else if (paquete.seccion === "transporte") {
        currentY = addRow(
          `• ${paquete.name}`,
          `${ocultarPrecios ? "" : `$${formatNumberWithDots(paquete.price)}`}`,
          10,
          currentY,
          12
        );
        currentY = addText(
          paquete.clave
            ? paquete.clave === "ida"
              ? "Fecha: " + paquete.fechaInicio
              : "Fecha: " + paquete.fechaFin
            : "Fechas: " + paquete.fechaInicio + " - " + paquete.fechaFin,
          12,
          currentY,
          10
        );
        currentY += 10;
      } else {
        if (!paquete.seccion) {
          currentY = addRow(
            `• ${paquete.name}`,
            `${ocultarPrecios ? "" : `$${formatNumberWithDots(paquete.price)}`}`,
            10,
            currentY,
            12
          );
        } else {
          if (paquete.seccion === "observacion") return;
          currentY = addRow(
            `• ${paquete.name} x ${paquete.count} personas`,
            `${ocultarPrecios ? "" : `$${formatNumberWithDots(paquete.price)}`}`,
            10,
            currentY,
            12
          );
        }
      }
    });

    currentY += 5;

    // --- Agregar Observaciones al fondo de la página ---

    const pageHeight = doc.internal.pageSize.getHeight();
    const rightMargin = 10;
    const observaciones = paquetesSeleccionados.filter((p) => p.seccion === "observacion");
    if (observaciones.length > 0) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);

      let obsY = pageHeight - 40; // Espacio vertical antes del total

      console.log(observaciones, "Observaciones?");

      observaciones.forEach((obs) => {
        const obsLines = doc.splitTextToSize(`Observacion: ${obs.name}`, 120); // Ajuste de ancho
        obsLines.forEach((line) => {
          doc.text(line, rightMargin, obsY);
          obsY += 5;
        });
      });
    }
    // --- Agregar Total + Disclaimer al fondo de la página ---

    const cantidadPersonas = busqueda?.detalleHabitaciones
      ? calcularTotalPersonas(busqueda.detalleHabitaciones).total
      : 1;

    const totalPorPersonaText =
      totalDolares === 0
        ? `Por persona: $${formatNumberWithDots(Math.floor(totalPesos / cantidadPersonas))}`
        : `Por persona: ARS $${formatNumberWithDots(
            Math.floor(totalPesos / cantidadPersonas)
          )} | USD $${formatNumberWithDots(Math.floor(totalDolares / cantidadPersonas))}`;

    const totalText =
      totalDolares === 0
        ? `Total: $${formatNumberWithDots(totalPesos)}`
        : `Total ARS: $${formatNumberWithDots(totalPesos)} | Total USD: $${formatNumberWithDots(
            totalDolares
          )}`;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    const totalTextWidth = doc.getTextWidth(totalText);
    const totalPorPersonaTextWidth = doc.getTextWidth(totalPorPersonaText);
    doc.text(
      totalText,
      doc.internal.pageSize.getWidth() - rightMargin - totalTextWidth,
      pageHeight - 27
    );
    doc.text(
      totalPorPersonaText,
      doc.internal.pageSize.getWidth() - rightMargin - totalPorPersonaTextWidth,
      pageHeight - 20
    );

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    const disclaimer = "El precio está sujeto a variación dependiendo de la fecha de pago.";
    const disclaimerWidth = doc.getTextWidth(disclaimer);
    doc.text(
      disclaimer,
      doc.internal.pageSize.getWidth() - rightMargin - disclaimerWidth,
      pageHeight - 12
    );

    {
      /*
        currentY = addText(
      totalDolares === 0
        ? `Total: $${formatNumberWithDots(totalPesos)}`
        : `Total ARS: $${formatNumberWithDots(totalPesos)} | Total USD: $${formatNumberWithDots(
            totalDolares
          )}`,
      margin,
      currentY,
      16,
      "bold"
    );
    currentY = addText(
      "El precio está sujeto a variación dependiendo de la fecha de pago.",
      margin,
      currentY,
      10,
      "italic"
    );

    */
    }

    doc.setProperties({ title: "Passport-Presupuesto" });
    doc.save("Passport-Presupuesto.pdf");
    doc.output("dataurlnewwindow");
  } catch (error) {
    console.error("PDF generation error:", error);
  }
};

function obtenerFechaActual() {
  const hoy = new Date();
  const dia = String(hoy.getDate()).padStart(2, "0");
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const anio = hoy.getFullYear();
  return `${dia}/${mes}/${anio}`;
}
