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

        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 10;
        let currentY = margin;

        // --- Helper function to add text ---
        const addText = (text, x, y, fontSize, fontStyle = "normal") => {
            doc.setFontSize(fontSize);
            doc.setFont("helvetica", fontStyle);
            const textLines = doc.splitTextToSize(text, pageWidth - 2 * margin);
            textLines.forEach(line => {
                doc.text(line, x, y);
                y += fontSize * 0.35; // Approximate line height
            });
            return y;
        };

        // --- Add Content ---
        let img = new Image();
        img.height = 40;
        img.width = 40;
        img.src = imageData.src;
        doc.addImage(img, "png", margin, currentY);

        if (clientName) {
            currentY = addText(`Cliente: ${clientName}`, 150, currentY + 10, 12);
        }
        currentY += 30;

        currentY = addText(`Presupuesto Passport Ski ${new Date().getFullYear()}`, margin, currentY, 20, "bold");
        currentY += 10;

        currentY = addText(`Fecha del presupuesto: ${obtenerFechaActual()}`, margin, currentY, 14);
        currentY += 10;

        if (busqueda.detalleHabitaciones) {
            currentY = addText(
                `${calcularTotalPersonas(busqueda.detalleHabitaciones).total} Personas - Fechas del viaje: ${stringDate(busqueda.startDate)} - ${
                    busqueda.endDate ? stringDate(busqueda.endDate) : formatDate(busqueda.startDate, calcularDiferenciaDiasProducto(busqueda.producto)).fechaFinal
                }`,
                margin,
                currentY,
                12
            );
            currentY += 15;
        }

        paquetesSeleccionados.forEach((paquete) => {
            if (paquete.seccion === "alojamiento") {
                currentY = addText(formatReglas(paquete.reglas), 20, currentY, 8);
                currentY += 5
            } else if (paquete.seccion === "transporte") {
                currentY = addText(`• ${paquete.name}: $${formatNumberWithDots(paquete.price)}`, 22, currentY, 12);
                currentY = addText(
                    paquete.clave
                        ? paquete.clave === "ida"
                            ? "Fecha: " + paquete.fechaInicio
                            : "Fecha: " + paquete.fechaFin
                        : "Fechas: " + paquete.fechaInicio + " - " + paquete.fechaFin,
                    20,
                    currentY,
                    10
                );
                currentY += 10;
            } else {
                currentY = addText(`• ${paquete.name}: $${formatNumberWithDots(paquete.price)}`, 17, currentY, 12);
            }
        });

        currentY = addText(
            totalDolares === 0
                ? `Total: $${formatNumberWithDots(totalPesos)}`
                : `Total ARS: $${formatNumberWithDots(totalPesos)} | Total USD: $${formatNumberWithDots(totalDolares)}`,
            margin,
            currentY,
            16,
            "bold"
        );
        currentY = addText("El precio está sujeto a variación dependiendo de la fecha de pago.", margin, currentY, 10, "italic");

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