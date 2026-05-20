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

    // Single temp instance for all pre-calculation (avoids creating one per package)
    const tempDoc = new jsPDF();
    const calculateTextHeight = (text, fontSize, pageWidth, margin) => {
      tempDoc.setFontSize(fontSize);
      const textLines = tempDoc.splitTextToSize(text, pageWidth - 2 * margin);
      return textLines.length * fontSize * 0.35 + 5;
    };

    // --- Calculate Total Height ---
    totalHeight += 40; // Image height
    if (clientName) {
      totalHeight += 12;
    }
    totalHeight += 20; // Title
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
      format: [210, totalHeight],
    });

    // pageWidth: narrowed text area (offset by 50) used for body text wrapping
    // fullPageWidth: true page width used for right-aligning prices and totals
    const fullPageWidth = doc.internal.pageSize.getWidth();
    const pageWidth = fullPageWidth - 50;
    const margin = 10;
    let currentY = margin;

    // --- Helper function to add text ---
    const addText = (text, x, y, fontSize, fontStyle = "normal") => {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", fontStyle);
      const textLines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      textLines.forEach((line) => {
        doc.text(line, x, y);
        y += fontSize * 0.5;
      });
      return y;
    };

    const addRow = (leftText, rightText, x, y, fontSize, discount) => {
      doc.setFontSize(fontSize);
      const textLines = doc.splitTextToSize(leftText, fullPageWidth - 4.2 * margin);

      doc.setFont("helvetica", "normal");

      textLines.forEach((line) => {
        doc.text(line, x, y);
        y += fontSize * 0.5;
      });

      const textWidth = ocultarPrecios ? 20 : doc.getTextWidth(rightText);
      doc.setFont("helvetica", "bold");
      if (textLines.length > 1) {
        doc.text(rightText, fullPageWidth - margin - textWidth, y - 12);
        if (discount) {
          doc.setFontSize(8);
          doc.setFont("helvetica", "italic");
          doc.setTextColor(150);
          doc.text(discount, fullPageWidth - 6, y - 6);
          doc.setTextColor(0);
          doc.setFontSize(fontSize);
        }
      } else {
        doc.text(rightText, fullPageWidth - margin - textWidth, y - 6);
        if (discount) {
          doc.setFontSize(8);
          doc.setFont("helvetica", "italic");
          doc.setTextColor(150);
          doc.text(discount, fullPageWidth - margin - textWidth, y);
          doc.setTextColor(0);
        }
      }

      return y;
    };

    // --- Add Content ---
    const img = new Image();
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

    const totalPersonas = busqueda.detalleHabitaciones
      ? calcularTotalPersonas(busqueda.detalleHabitaciones).total
      : 1;

    if (busqueda.detalleHabitaciones) {
      currentY = addText(
        `${totalPersonas} Personas - Fechas del viaje: ${stringDate(busqueda.startDate)} - ${
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

    paquetesSeleccionados.forEach((paquete) => {
      // Formats price respecting currency and promo state (Family Plan)
      const formatPrecio = (price, moneda, discount = 0) => {
        if (ocultarPrecios) return "";
        if (paquete.promo) return "GRATIS";
        const prefijo = moneda === "USD" ? "USD $" : "$";
        const precioFinal = discount > 0 ? price - discount : price;
        return `${prefijo}${formatNumberWithDots(precioFinal)}`;
      };

      if (paquete.seccion === "alojamiento") {
        currentY = addRow(
          `• ${paquete.name}`,
          formatPrecio(paquete.price, paquete.moneda, paquete.discount),
          10,
          currentY,
          12,
          paquete.discount > 0
            ? `${formatNumberPercentage(paquete.discount, paquete.price)}% OFF aplicado`
            : null
        );
        currentY = addText(formatReglas(paquete.reglas), 12, currentY, 8);
        currentY += 5;
      } else if (paquete.seccion === "transporte") {
        currentY = addRow(
          `• ${paquete.name}`,
          formatPrecio(paquete.price, paquete.moneda),
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
            formatPrecio(paquete.price, paquete.moneda),
            10,
            currentY,
            12
          );
        } else {
          if (paquete.seccion === "observacion") return;
          currentY = addRow(
            `• ${paquete.name} x ${paquete.count} personas`,
            formatPrecio(paquete.price, paquete.moneda),
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

      let obsY = pageHeight - 40;

      observaciones.forEach((obs) => {
        const obsLines = doc.splitTextToSize(`Observacion: ${obs.name}`, 120);
        obsLines.forEach((line) => {
          doc.text(line, rightMargin, obsY);
          obsY += 5;
        });
      });
    }

    // --- Agregar Total + Disclaimer al fondo de la página ---
    const cantidadPersonas = totalPersonas;

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

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Fecha de presupuesto: ${stringDate(new Date())}`, margin, pageHeight - 27);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    const totalTextWidth = doc.getTextWidth(totalText);
    const totalPorPersonaTextWidth = doc.getTextWidth(totalPorPersonaText);
    doc.text(
      totalText,
      fullPageWidth - rightMargin - totalTextWidth,
      pageHeight - 27
    );
    doc.text(
      totalPorPersonaText,
      fullPageWidth - rightMargin - totalPorPersonaTextWidth,
      pageHeight - 20
    );

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    const disclaimer = "El precio está sujeto a variación dependiendo de la fecha de pago.";
    const disclaimerWidth = doc.getTextWidth(disclaimer);
    doc.text(
      disclaimer,
      fullPageWidth - rightMargin - disclaimerWidth,
      pageHeight - 12
    );

    doc.setProperties({ title: "Passport-Presupuesto" });
    doc.save("Passport-Presupuesto.pdf");
    doc.output("dataurlnewwindow");
  } catch (error) {
    console.error("PDF generation error:", error);
  }
};
