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
  const paquetesPorSeccion = paquetesSeleccionados.reduce((grupos, paquete) => {
    if (!grupos[paquete.seccion]) {
      grupos[paquete.seccion] = []; // Inicializa la sección si no existe
    }
    grupos[paquete.seccion].push(paquete); // Agrega el paquete a la sección correspondiente
    return grupos;
  }, {});

  console.log(busqueda);

  // Obtener las secciones ordenadas (alojamiento primero)
  const seccionesOrdenadas = Object.entries(paquetesPorSeccion).sort(([seccionA], [seccionB]) => {
    if (seccionA === "alojamiento") return -1;
    if (seccionB === "alojamiento") return 1;
    return 0; // El resto queda igual
  });

  // Iterar sobre las secciones ordenadas
  seccionesOrdenadas.forEach(([seccion, paquetes]) => {
    console.log(`Sección: ${seccion}`),
      paquetes.forEach((paquete) => {
        console.log(`- Paquete: ${paquete.name}, Precio: ${paquete.price}`);
      });
  });
  const handleCreatePDFClick = () => {
    setIsModalOpen(true);
  };

  let personas;
  if (busqueda.detalleHabitaciones) personas = calcularTotalPersonas(busqueda.detalleHabitaciones);

  const diasViaje = calcularDiferenciaDiasProducto(busqueda.producto);
  const fechasFormateadas = formatDate(busqueda.startDate, diasViaje);
  const doc = new jsPDF("p", "px", "a4");

  let img = new Image();
  img.height = 40;
  img.width = 40;
  img.src = imageData.src;
  if (clientName) doc.text(`Cliente: ${clientName}`, 250, 20);

  doc.addImage(img, "png", 10, 10);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(`Presupuesto Passport Ski ${new Date().getFullYear()}`, 10, 90);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.text(`Fecha del presupuesto: ${obtenerFechaActual()}`, 14, 110);

  let alturaY = 125;

  doc.setFontSize(12);
  paquetesSeleccionados.forEach((paquete, index) => {
    let textoPaquete = `• ${paquete.name}: $${formatNumberWithDots(paquete.price)}`;
    alturaY = alturaY + 20;
    // Agregar detalles específicos si es un traslado
    if (paquete.seccion === "alojamiento") {
      //console.log(espacioExtra);
      let descripcion = formatReglas(paquete.reglas);
      textoPaquete += ` - ${paquete.noches} noches`;

      {/*if (personas)
        doc.text(
          `${personas.total} Personas - Fechas del viaje: ${stringDate(busqueda.startDate)} - ${
            busqueda.endDate ? stringDate(busqueda.endDate) : fechasFormateadas.fechaFinal
          }`,
          14,
          125
        );
        */}
      if (personas)
        doc.text(
          `${personas.total} Personas - Fechas del viaje: ${stringDate(busqueda.startDate)} - ${
            busqueda.endDate ? stringDate(busqueda.endDate) : fechasFormateadas.fechaFinal
          }`,
          14,
          125
        );

      doc.setFontSize(12);
      doc.text(textoPaquete, 17, alturaY);
      doc.setFontSize(8);
      const maxWidth = 380; // Adjust width based on your margins and page size
      descripcion = doc.splitTextToSize(descripcion, maxWidth);
      doc.text(descripcion, 20, alturaY + 10);
      doc.setFontSize(12);
      alturaY = alturaY + 40;
    } else if (paquete.seccion === "transporte") {
      let fechas = paquete.clave
        ? paquete.clave === "ida"
          ? "Fecha: " + paquete.fechaInicio
          : "Fecha: " + paquete.fechaFin
        : "Fechas: " + paquete.fechaInicio + " - " + paquete.fechaFin;

      doc.setFontSize(12);
      doc.text(textoPaquete, 22, alturaY);

      doc.setFontSize(10);
      doc.text(fechas, 20, alturaY + 10);
      alturaY = alturaY + 20;
    } else {
      // Agregar texto al documento PDF
      const maxWidth = 380; // Adjust width based on your margins and page size
      textoPaquete = doc.splitTextToSize(textoPaquete, maxWidth);
      doc.setFontSize(12);
      doc.text(textoPaquete, 17, alturaY);

      alturaY = alturaY + 20;
    }
  });
  alturaY = alturaY + 30;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  if (totalDolares === 0) {
    doc.text(`Total: $${formatNumberWithDots(totalPesos)}`, 14, alturaY);
  } else {
    doc.text(
      `Total ARS: $${formatNumberWithDots(totalPesos)} | Total USD: $${formatNumberWithDots(
        totalDolares
      )}`,
      14,
      alturaY
    );
  }
  doc.setFontSize(10);

  doc.setFont("helvetica", "italic");
  doc.text("El precio está sujeto a variación dependiendo de la fecha de pago.", 14, alturaY + 10);
  /*
    paquetesSeleccionados.forEach((paquete, index) => {
      doc.text(• ${paquete.name}: $${formatNumberWithDots(paquete.price)}, 20, 80 + index * 11);
    });
    */

  doc.getCurrentPageInfo("Passport-Presupuesto");

  doc.save("Passport-Presupuesto.pdf");
  doc.setProperties({ title: "Passport-Presupuesto" });
  doc.output("dataurlnewwindow");
};

function obtenerFechaActual() {
  const hoy = new Date(); // Obtiene la fecha actual
  const dia = String(hoy.getDate()).padStart(2, "0"); // Asegura que el día tenga dos dígitos
  const mes = String(hoy.getMonth() + 1).padStart(2, "0"); // Mes (0 = Enero, +1 para ajustar)
  const anio = hoy.getFullYear(); // Obtiene el año completo

  return `${dia}/${mes}/${anio}`; // Devuelve la fecha en formato dd/mm/aaaa
}
