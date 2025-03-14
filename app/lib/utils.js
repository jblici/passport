import jsPDF from "jspdf";
import PaquetesHoteles from "../components/Paquetes/hoteles";
import PaquetesEquipos from "../components/Paquetes/equipos";
import PaquetesClases from "../components/Paquetes/clases";
import PaquetesPases from "../components/Paquetes/pases";
import PaquetesTransporte from "../components/Paquetes/transporte";
import Equipos from "../components/Formularios/equipos";
import Clases from "../components/Formularios/clases";
import Pases from "../components/Formularios/pases";
import Transporte from "../components/Formularios/transporte";
import Hoteles from "../components/Formularios/hoteles";


const formatReglas = (text) => {
  return text
    .replace(/;/g, ",") // Reemplaza ; por ,
    .replace(/\. /g, ".\n"); // Agrega un salto de línea después de cada punto
};

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
    if (seccionA === "alojamiento") return -1; // "alojamiento" primero
    if (seccionB === "alojamiento") return 1; // "alojamiento" primero
    return 0; // El resto queda igual
  });

  // Iterar sobre las secciones ordenadas
  seccionesOrdenadas.forEach(([seccion, paquetes]) => {
    console.log(`Sección: ${seccion}`),
      paquetes.forEach((paquete) => {
        console.log(`- Paquete: ${paquete.name}, Precio: ${paquete.price}`);
        // Aquí puedes agregar lógica específica para cada paquete
      });
  });
  const handleCreatePDFClick = () => {
    setIsModalOpen(true);
  };

  

  function obtenerFechaActual() {
    const hoy = new Date(); // Obtiene la fecha actual
    const dia = String(hoy.getDate()).padStart(2, "0"); // Asegura que el día tenga dos dígitos
    const mes = String(hoy.getMonth() + 1).padStart(2, "0"); // Mes (0 = Enero, +1 para ajustar)
    const anio = hoy.getFullYear(); // Obtiene el año completo

    return `${dia}/${mes}/${anio}`; // Devuelve la fecha en formato dd/mm/aaaa
  }
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
    // let espacioExtra = 10;
    alturaY = alturaY + 20;
    // let espacioY = 80 + index * 11 + espacioExtra;
    // Agregar detalles específicos si es un traslado
    if (paquete.seccion === "alojamiento") {
      //console.log(espacioExtra);
      let descripcion = formatReglas(paquete.reglas);
      textoPaquete += ` - ${paquete.noches} noches`;
      
      if (personas) doc.text(`${personas.total} Personas - Fechas del viaje: ${fechasFormateadas.fechaInicial} - ${
        busqueda.endDate ? formatDate(busqueda.endDate) : fechasFormateadas.fechaFinal
      }`, 14, 125);

      doc.setFontSize(12);
      doc.text(textoPaquete, 17, alturaY);
      doc.setFontSize(8);
      const maxWidth = 380; // Adjust width based on your margins and page size
      descripcion = doc.splitTextToSize(descripcion,maxWidth)
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
      // doc.text(textoPaquete, 17, espacioY);
      doc.text(textoPaquete, 22, alturaY);

      doc.setFontSize(10);
      doc.text(fechas, 20, alturaY + 10);
      alturaY = alturaY + 20;
    } else {
      // Agregar texto al documento PDF
      textoPaquete= doc.splitTextToSize(textoPaquete,maxWidth);
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


// createPFf no funciona!
// export const createPDF = (config) => {
//   const {
//     clientName,
//     imageData,
//     paquetesSeleccionados,
//     busqueda,
//     calcularTotalPersonas,
//     formatNumberWithDots,
//   } = config;

//   const doc = new jsPDF();
//   let currentY = 20; // Starting Y position
//   const margin = 14;
//   const lineHeight = 10;

//   // Helper function to add text and update Y position
//   const addText = (text, fontSize = 12, font = "helvetica", style = "normal", indent = 0) => {
//     doc.setFont(font, style);
//     doc.setFontSize(fontSize);
//     doc.text(text, margin + indent, currentY);
//     currentY += lineHeight;
//     return doc;
//   };

//   // Helper function to check if content will overflow page
//   const willOverflow = (yPosition, additionalSpace = 0) => {
//     return yPosition + additionalSpace > 280; // A4 height is ~297, leaving margin
//   };

//   // Add logo
//   if (imageData?.src) {
//     const img = new Image();
//     img.src = imageData.src;
//     doc.addImage(img, "png", margin, currentY - 10, 40, 40);
//   }

//   // Add client name (if exists) aligned to the right
//   if (clientName) {
//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(12);
//     doc.text(`Cliente: ${clientName}`, 150, currentY);
//   }

//   currentY += 30; // Space after header

//   // Title
//   addText("Presupuesto Passport Ski 2024", 20, "helvetica", "bold");
//   currentY += 5;

//   // Date
//   const getCurrentDate = () => {
//     const today = new Date();
//     return `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(
//       2,
//       "0"
//     )}/${today.getFullYear()}`;
//   };
//   addText(`Fecha del presupuesto: ${getCurrentDate()}`, 14);

//   // Total persons (if available)
//   if (busqueda?.detalleHabitaciones) {
//     const personas = calcularTotalPersonas(busqueda.detalleHabitaciones);
//     if (personas) {
//       addText(`${personas.total} Personas`, 14);
//     }
//   }

//   currentY += 10; // Extra space before packages

//   // Process packages
//   paquetesSeleccionados.forEach((paquete, index) => {
//     // Check if we need a new page
//     if (willOverflow(currentY, 40)) {
//       doc.addPage();
//       currentY = 20;
//     }

//     // Package name and price
//     const textoPaquete = `• ${paquete.name}: $${formatNumberWithDots(paquete.price)}`;
//     addText(textoPaquete, 12, "helvetica", "normal", 3);

//     // Handle specific package types
//     if (paquete.seccion === "transporte") {
//       const fechas = paquete.clave
//         ? `Fecha: ${paquete.clave === "ida" ? paquete.fechaInicio : paquete.fechaFin}`
//         : `Fechas: ${paquete.fechaInicio} - ${paquete.fechaFin}`;
//       addText(fechas, 10, "helvetica", "normal", 6);
//       currentY += 2;
//     } else if (paquete.seccion === "alojamiento") {
//       const descripcion = `${paquete.noches} noches - ${paquete.reglas}`;
//       addText(descripcion, 8, "helvetica", "normal", 6);
//       currentY += 5;
//     }

//     currentY += 3; // Space between packages
//   });

//   return doc;
// };

export function formatNumberWithDots(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const formatDate = (date, dias) => {
  const fecha = new Date(date);

  // Formatear fecha inicial
  const dia = ("0" + fecha.getDate()).slice(-2); // Asegura que el día tenga 2 dígitos
  const mes = ("0" + (fecha.getMonth() + 1)).slice(-2); // Meses son 0-indexados, por eso se suma 1
  const anio = fecha.getFullYear();

  const fechaInicial = `${dia}/${mes}/${anio}`;

  // Sumar días a la fecha inicial
  fecha.setDate(fecha.getDate() + dias);

  // Formatear la fecha final después de sumar los días
  const diaFinal = ("0" + fecha.getDate()).slice(-2); // Asegura que el día tenga 2 dígitos
  const mesFinal = ("0" + (fecha.getMonth() + 1)).slice(-2); // Meses son 0-indexados, por eso se suma 1
  const anioFinal = fecha.getFullYear();

  const fechaFinal = `${diaFinal}/${mesFinal}/${anioFinal}`;

  return { fechaInicial, fechaFinal };
};

const stringDate = (dateString) => {
  const date = new Date(dateString);

  if (isNaN(date)) return "Fecha inválida"; // Verifica si la fecha es válida

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() devuelve 0-11, por eso sumamos 1
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

//BUSQUEDA PAQUETES HOTELES

export const handleHoteles = (
  startDate,
  endDate,
  hotelSeleccionado,
  producto,
  cerro,
  paquetes,
  setHoteles,
  detalleHabitaciones
) => {
  try {
    const totalPersonas = calcularTotalPersonas(detalleHabitaciones);
    const busquedaHoteles = calcularHoteles(
      startDate,
      endDate,
      cerro,
      paquetes,
      hotelSeleccionado,
      producto,
      totalPersonas
    );
    console.log(busquedaHoteles);
    setHoteles(busquedaHoteles);
  } catch (error) {
    console.error(error);
  }
};

//FUNCION PARA BUSCAR PAQUETES QUE MATCHEAN LAS FECHAS Y PERSONAS

function calcularHoteles(
  startDate,
  endDate,
  cerro,
  paquetes,
  hotelSeleccionado,
  producto,
  totalPersonas
) {
  const inicio = startDate;
  const fin = endDate;
  let resultados = {};
  let paquetesFiltrados = paquetes;

  if (cerro) {
    paquetesFiltrados = paquetesFiltrados.filter((paquete) => paquete.cerro === cerro);
  }

  if (hotelSeleccionado.length > 0) {
    paquetesFiltrados = paquetesFiltrados.filter((paquete) =>
      hotelSeleccionado.includes(paquete.hotel)
    );
  }

  // Filtrado adicional para "Las Leñas"
  if (cerro === "Las Leñas" && producto) {
    const noches = calcularDiferenciaDiasProducto(producto);
    const fechaInicio = new Date(startDate);
    const fechaFin = new Date(startDate);
    fechaFin.setDate(fechaInicio.getDate() + noches); // Calculamos la fecha final
    paquetesFiltrados = paquetesFiltrados.filter((paquete) => paquete.week === producto);

    paquetesFiltrados = paquetesFiltrados.filter((paquete) => {
      return paquete.minNoches <= noches;
    });

    // Filtrar paquetes que contengan la fecha de inicio
    paquetesFiltrados = paquetesFiltrados.filter((paquete) => {
      const fechaInicio = parseDate(paquete.fechaInicio);
      const fechaFinal = parseDate(paquete.fechaFinal);
      return startDate >= fechaInicio && startDate <= fechaFinal;
      //return startDate >= fechaInicio;
    });

    totalPersonas.habitaciones.forEach((habitacion, index) => {
      const { mayores, menores, total } = habitacion;

      const paquetesPorHabitacion = paquetesFiltrados.filter(
        (paquete) =>
          paquete.personas === total ||
          (paquete.personas === total - 1 && paquete.camaExtra === "Si")
      );

      paquetesPorHabitacion.forEach((paquete) => {
        let precioHabitacion;

        if (paquete.personas === total - 1 && paquete.camaExtra === "Si") {
          // Si necesita usar la cama extra
          if (menores > 0) {
            precioHabitacion =
              paquete.extraMenor * 1 +
              (paquete.precioMenor
                ? paquete.precioMenor * (menores - 1)
                : paquete.precio * (menores - 1)) +
              paquete.precio * mayores;
          } else {
            precioHabitacion = paquete.extraMayor * 1 + paquete.precio * (mayores - 1);
          }
        } else {
          // Si no necesita usar la cama extra, aplicar precios normales
          precioHabitacion =
            paquete.precio * mayores +
            (paquete.precioMenor ? paquete.precioMenor * menores : paquete.precio * menores);
        }

        const habitacionKey = `Habitacion ${index + 1}`;
        if (!resultados[habitacionKey]) {
          resultados[habitacionKey] = [];
        }

        resultados[habitacionKey].push({
          id: index + paquete.id + 1,
          totalPersonas: total,
          mayores,
          menores,
          noches,
          precioTotal: precioHabitacion,
          paquetesUtilizados: paquete,
          fechaInicio: stringDate(startDate),
          fechaFinal: stringDate(fechaFin),
        });
      });
    });
  } else {
    // Agrupar paquetes por hotel, habitación y personas
    totalPersonas.habitaciones.forEach((habitacion, index) => {
      const { mayores, menores, total } = habitacion;
      const paquetesPorHabitacion = {};

      const cantidadNoches = calcularDiferenciaDias(inicio, fin);
      console.log(cantidadNoches);
      paquetesFiltrados = paquetesFiltrados.filter((paquete) => {
        return paquete.minNoches <= cantidadNoches;
      });

      const paquetesHabitacion = paquetesFiltrados.filter(
        (paquete) =>
          paquete.personas === total ||
          (paquete.personas === total - 1 && paquete.camaExtra === "Si")
      );

      const habitacionKey = `Habitacion ${index + 1}`;
      if (!resultados[habitacionKey]) {
        resultados[habitacionKey] = [];
      }

      paquetesHabitacion.forEach((paquete) => {
        const clave = `${paquete.hotel}-${paquete.habitacion}-${paquete.personas}-${
          paquete.minNoches
        }-${paquete.menor ? paquete.menor : null}-${paquete.tarifa ? paquete.tarifa : null}`;
        if (!paquetesPorHabitacion[clave]) {
          paquetesPorHabitacion[clave] = [];
        }
        paquetesPorHabitacion[clave].push(paquete);
      });

      // Verificar paquetes que cubren completamente las fechas seleccionadas y combinaciones continuas
      for (const clave in paquetesPorHabitacion) {
        const paquetess = paquetesPorHabitacion[clave];
        paquetess.sort((a, b) => parseDate(a.fechaInicio) - parseDate(b.fechaInicio));

        for (let i = 0; i < paquetess.length; i++) {
          const combinacionActual = [];
          let totalNoches = 0;
          let totalPrecio = 0;
          let fechaContinua = inicio;

          for (let j = i; j < paquetess.length; j++) {
            const paquete = paquetess[j];
            const paqueteInicio = parseDate(paquete.fechaInicio);
            const paqueteFin = parseDate(paquete.fechaFinal);

            // Verificar si el paquete es continuo con la última fecha de la combinación
            if (paqueteInicio <= fechaContinua && paqueteFin >= fechaContinua) {
              const noches = calcularDiferenciaDias(
                Math.max(paqueteInicio, fechaContinua),
                Math.min(paqueteFin, fin)
              );

              if (cerro === "Castor") {
                let precioHabitacion;

                if (paquete.personas === total - 1 && paquete.camaExtra === "Si") {
                  // Si necesita usar la cama extra
                  if (menores > 0) {
                    precioHabitacion =
                      paquete.extraMenor * 1 +
                      (paquete.precioMenor
                        ? paquete.precioMenor * (menores - 1)
                        : paquete.precio * (menores - 1)) +
                      paquete.precio * mayores;
                  } else {
                    precioHabitacion = paquete.extraMayor * 1 + paquete.precio * (mayores - 1);
                  }
                } else {
                  // Si no necesita usar la cama extra, aplicar precios normales
                  precioHabitacion =
                    paquete.precio * mayores +
                    (paquete.precioMenor
                      ? paquete.precioMenor * menores
                      : paquete.precio * menores);
                }
                totalPrecio += noches * precioHabitacion;
                totalNoches += noches;
              } else {
                totalPrecio += noches * (paquete.precio * total);
                totalNoches += noches;
              }

              combinacionActual.push({
                ...paquete,
              });

              // Actualizar la fecha continua
              fechaContinua = new Date(paqueteFin);
              fechaContinua.setDate(fechaContinua.getDate() + 1);

              const combinacionInicio = parseDate(combinacionActual[0].fechaInicio);
              const combinacionFin = parseDate(
                combinacionActual[combinacionActual.length - 1].fechaFinal
              );

              if (combinacionInicio <= inicio && combinacionFin >= fin) {
                resultados[habitacionKey].push({
                  id: i + j + 1,
                  totalPersonas: total,
                  mayores,
                  menores,
                  noches: totalNoches,
                  precioTotal: totalPrecio,
                  precioPromedio: Math.round(totalPrecio / totalNoches),
                  fechaInicio: stringDate(inicio),
                  fechaFinal: stringDate(fin),
                  paquetesUtilizados:
                    combinacionActual.length > 1
                      ? { paquetes: combinacionActual }
                      : combinacionActual[0],
                });
                break; // Salir del loop si una combinación válida se encontró
              }
            } else {
              break; // Salir si no hay continuidad en las fechas
            }
          }
        }
      }
    });
  }

  if (resultados.length === 0) {
    throw new Error("No se encontraron paquetes continuos que cubran las fechas seleccionadas.");
  }

  return resultados;
}

//CALCULAR HABITACIONES

function calcularTotalPersonas(detalleHabitaciones) {
  const resultado = { total: 0, habitaciones: [] };
  let totalMayoresCombinado = 0;
  let totalMenoresCombinado = 0;

  // Recorremos las habitaciones
  detalleHabitaciones.forEach((habitacion) => {
    const mayores = Number(habitacion.mayores) || 0;
    const menores = Number(habitacion.menores) || 0;
    const totalPersonas = mayores + menores;

    // Sumar al total general de personas
    resultado.total += totalPersonas;

    // Sumar al total combinado de mayores y menores
    totalMayoresCombinado += mayores;
    totalMenoresCombinado += menores;

    // Agregar cada habitación individual al array
    resultado.habitaciones.push({
      total: totalPersonas,
      mayores: mayores,
      menores: menores,
    });
  });

  // Solo crear la habitación combinada si hay más de una habitación
  if (detalleHabitaciones.length > 1) {
    const totalPersonasCombinada = totalMayoresCombinado + totalMenoresCombinado;
    resultado.habitaciones.push({
      total: totalPersonasCombinada,
      mayores: totalMayoresCombinado,
      menores: totalMenoresCombinado,
    });
  }

  return resultado;
}

//FORMATEAR FECHAS

function parseDate(dateString) {
  const parts = dateString.split("/");
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Los meses en JavaScript son 0-indexados
  const year = parseInt(parts[2], 10);
  return new Date(year, month, day);
}

//CALCULO DE NOCHES ENTRE LAS DOS FECHAS SELECCIONADAS

function calcularDiferenciaDias(fechaInicio, fechaFin) {
  const unDia = 1000 * 60 * 60 * 24;
  return Math.ceil((fechaFin - fechaInicio) / unDia);
}

function calcularDiferenciaDiasProducto(producto) {
  let diasASumar = 0;

  if (producto === "MiniWeek") {
    diasASumar = 2;
  } else if (producto === "MaxiWeek") {
    diasASumar = 5;
  } else if (producto === "SkiWeek") {
    diasASumar = 7;
  }

  return diasASumar;
}

//BUSQUEDA EQUIPOS

export const handleEquipos = (cerro, rentals, setEquipos, startDate, dias, gama) => {
  let rentalsFiltradas = rentals;

  if (cerro) {
    rentalsFiltradas = rentalsFiltradas.filter(
      (rental) => rental.cerro.toUpperCase() === cerro.toUpperCase()
    );
  }

  if (gama) {
    rentalsFiltradas = rentalsFiltradas.filter(
      (rental) => rental.gama.toUpperCase() === gama.toUpperCase()
    );
  }

  if (dias) {
    rentalsFiltradas = rentalsFiltradas.filter((pase) => pase.dias === dias);
  }

  // Filtrar por fechas
  if (startDate && dias) {
    const fechaFin = sumarDias(new Date(startDate), dias - 1); // Clonar startDate

    rentalsFiltradas = rentalsFiltradas.filter((pase) => {
      const paseInicio = parseDate(pase.fechaInicio);
      const paseFinal = parseDate(pase.fechaFinal);

      if (cerro === "Las Leñas") {
        return paseInicio <= startDate && startDate <= paseFinal;
      } else {
        return paseInicio <= startDate && paseFinal >= fechaFin;
      }
    });
  }

  setEquipos(rentalsFiltradas);
};

function sumarDias(fecha, dias) {
  // Asegúrate de que fecha sea un objeto Date
  const fechaObj = new Date(fecha);

  // Sumar los días
  fechaObj.setDate(fechaObj.getDate() + dias);

  return fechaObj; // Devuelve la nueva fecha
}

export const handleClases = (cerro, clases, setClases, startDate, dias, tipo) => {
  let clasesFiltradas = clases;

  if (cerro) {
    clasesFiltradas = clasesFiltradas.filter((clase) => clase.cerro === cerro);
  }

  if (tipo) {
    clasesFiltradas = clasesFiltradas.filter((clase) => clase.tipo === tipo);
  }

  if (dias) {
    clasesFiltradas = clasesFiltradas.filter((clase) =>
      dias === 1 ? Number(clase.dias) <= dias : Number(clase.dias) === dias
    );
  }

  // Filtrar por fechas
  if (startDate && dias) {
    const fechaFin = sumarDias(new Date(startDate), dias - 1); // Clonar startDate

    clasesFiltradas = clasesFiltradas.filter((clase) => {
      const paseInicio = parseDate(clase.fechaInicio);
      const paseFinal = parseDate(clase.fechaFinal);

      // Chequear si startDate esta dentro de las fechas del pase
      if (cerro === "Las Leñas") {
        return paseInicio <= startDate && startDate <= paseFinal;
      } else {
        return paseInicio <= startDate && paseFinal >= fechaFin;
      }
    });
  }

  setClases(clasesFiltradas);
};

//BUSQUEDA PASES

export const handlePases = (cerro, pases, setPases, startDate, dias, tipo) => {
  let pasesFiltrados = pases;

  if (cerro) {
    pasesFiltrados = pasesFiltrados.filter(
      (pase) => pase.cerro.toUpperCase() === cerro.toUpperCase()
    );
  }

  if (tipo) {
    pasesFiltrados = pasesFiltrados.filter(
      (pase) => pase.tipo.toUpperCase() === tipo.toUpperCase()
    );
  }

  if (dias) {
    pasesFiltrados = pasesFiltrados.filter((pase) =>
      dias === 1 ? Number(pase.dias) <= dias : Number(pase.dias) === dias
    );
  }

  // Filtrar por fechas (la fecha de inicio debe estar dentro del rango de fechas del pase)
  if (startDate && dias) {
    const fechaFin = sumarDias(new Date(startDate), dias - 1); // Clonar startDate

    pasesFiltrados = pasesFiltrados.filter((pase) => {
      const paseInicio = parseDate(pase.fechaInicio);
      const paseFinal = parseDate(pase.fechaFinal);

      if (cerro === "Las Leñas") {
        return paseInicio <= startDate && startDate <= paseFinal;
      } else {
        return paseInicio <= startDate && paseFinal >= fechaFin;
      }
    });
  }
  console.log("final fechas", pasesFiltrados);

  setPases(pasesFiltrados);
};

export const handleTransporte = (
  cerro,
  traslado,
  setTraslado,
  startDate,
  endDate,
  tipoTransporte,
  claseTransporte,
  personas
) => {
  let transporteFiltrado = traslado;
  console.log(tipoTransporte, claseTransporte, startDate, endDate);
  let ida = [];
  let vuelta = [];
  const inicio = new Date(startDate).toLocaleDateString("es-AR");
  const fin = new Date(endDate).toLocaleDateString("es-AR");

  // 1. Filtrar por cerro, origen y destino
  if (cerro) {
    transporteFiltrado = transporteFiltrado.filter((paquete) => paquete.cerro === cerro);
  }

  if (startDate && endDate) {
    transporteFiltrado = transporteFiltrado.filter((clase) => {
      const paseInicio = parseDate(clase.fechaInicio);
      const paseFinal = parseDate(clase.fechaFinal);

      return paseInicio <= startDate && startDate <= paseFinal;
    });
  }

  // 2. Separar por tipo de transporte
  if (tipoTransporte === "Pasaje") {
    // Solo incluir paquetes que sean de servicio "Pasaje"
    transporteFiltrado = transporteFiltrado.filter((paquete) => paquete.servicio === "Pasaje");

    transporteFiltrado = transporteFiltrado.map((paquete) => ({
      ...paquete,
      inicio,
      fin,
    }));

    setTraslado(transporteFiltrado);
  } else if (tipoTransporte === "Transfer") {
    if (claseTransporte) {
      if (claseTransporte === "Privado") {
        transporteFiltrado = transporteFiltrado.filter((paquete) => paquete.personas > 1);
      } else {
        transporteFiltrado = transporteFiltrado.filter((paquete) => paquete.personas === 1);
      }
    }
    // Dividir en secciones de ida y vuelta

    if (personas) {
      transporteFiltrado = transporteFiltrado.filter((paquete) => paquete.personas >= personas);
    }

    transporteFiltrado = transporteFiltrado.map((paquete) => ({
      ...paquete,
      inicio,
      fin,
    }));

    console.log(transporteFiltrado);

    ida = transporteFiltrado.filter((paquete) => paquete.tramo === "Ida");
    vuelta = transporteFiltrado.filter((paquete) => paquete.tramo === "Vuelta");

    if (ida.length === 0 || vuelta.length === 0) {
      setTraslado(transporteFiltrado);
    } else {
      setTraslado({ ida, vuelta });
    }
  }
};

export const handleBusqueda = (
  category,
  resHoteles,
  resPases,
  resClases,
  resTraslado,
  resEquipos,
  agregarPaquete,
  reglas
) => {
  // Lógica para manejar la búsqueda basada en la categoría
  if (category === "Equipos") {
    if (!resEquipos) return null;
    return <PaquetesEquipos resultados={resEquipos} agregarPaquete={agregarPaquete} />;
  } else if (category === "Clases") {
    if (!resClases) return null;
    return <PaquetesClases resultados={resClases} agregarPaquete={agregarPaquete} />;
  } else if (category === "Medios de Elevación") {
    if (!resPases) return null;
    return <PaquetesPases resultados={resPases} agregarPaquete={agregarPaquete} />;
  } else if (category === "Transporte") {
    if (!resTraslado) return null;
    return <PaquetesTransporte resultados={resTraslado} agregarPaquete={agregarPaquete} />;
  } else if (category === "Alojamientos") {
    if (!resHoteles) return null;
    return (
      <PaquetesHoteles resultados={resHoteles} agregarPaquete={agregarPaquete} reglas={reglas} />
    );
  }
};

export const handleFormularios = (
  category,
  paquetes,
  rentals,
  clases,
  pases,
  traslado,
  setHoteles,
  setEquipos,
  setPases,
  setClases,
  setTraslado,
  cerro,
  setCerro,
  setBusqueda,
  startDate,
  setStartDate
) => {
  // Lógica para manejar la búsqueda basada en la categoría
  if (category === "Equipos") {
    return (
      <Equipos
        category={category}
        equipos={rentals}
        setEquipos={setEquipos}
        cerro={cerro}
        setCerro={setCerro}
        startDate={startDate}
        setStartDate={setStartDate}
      />
    );
  } else if (category === "Clases") {
    return (
      <Clases
        category={category}
        clases={clases}
        setClases={setClases}
        cerro={cerro}
        setCerro={setCerro}
        startDate={startDate}
        setStartDate={setStartDate}
      />
    );
  } else if (category === "Medios de Elevación") {
    return (
      <Pases
        category={category}
        pases={pases}
        setPases={setPases}
        cerro={cerro}
        setCerro={setCerro}
        startDate={startDate}
        setStartDate={setStartDate}
      />
    );
  } else if (category === "Transporte") {
    return (
      <Transporte
        category={category}
        traslado={traslado}
        setTraslado={setTraslado}
        cerro={cerro}
        setCerro={setCerro}
        startDate={startDate}
        setStartDate={setStartDate}
      />
    );
  } else if (category === "Alojamientos") {
    return (
      <Hoteles
        category={category}
        paquetes={paquetes}
        setHoteles={setHoteles}
        cerro={cerro}
        setCerro={setCerro}
        setBusqueda={setBusqueda}
        startDate={startDate}
        setStartDate={setStartDate}
      />
    );
  }
};

export const verificarFamilyPlan = (
  paquetesTemp,
  isChecked,
  setFamilyPlan,
  setPaquetesSeleccionados,
  setFlag,
  setIsChecked
) => {
  const secciones = ["pases", "equipos", "clases"];
  let activarFamilyPlan = false;
  const nuevosPaquetes = JSON.parse(JSON.stringify(paquetesTemp));

  //console.log("entre a verificar family plan");

  secciones.forEach((seccion) => {
    const paquetesPorSeccion = nuevosPaquetes.filter((paquete) => {
      const esSeccionClases = seccion === "clases";
      const minDias = esSeccionClases ? 6 : 7;

      return (
        paquete.seccion === seccion && // Coincide con la sección
        !paquete.promo && // No es promo
        Number(paquete.days) >= minDias // Cumple con el mínimo de días según la sección
      );
    });

    const totalCount = paquetesPorSeccion.reduce((sum, paquete) => sum + paquete.count, 0);

    if (totalCount >= 4) {
      // Activar Family Plan si se cumplen las condiciones
      setFamilyPlan(true);
      activarFamilyPlan = true;

      let restante = totalCount >= 4 && totalCount < 6 ? 1 : 2; // Determina cuántos paquetes necesitamos procesar
      console.log("Restante", restante);

      if (isChecked) {
        while (restante > 0) {
          // Buscar el paquete más barato que no tenga promo
          const paqueteMasBarato = paquetesPorSeccion.reduce((min, paquete) =>
            paquete.price < min.price ? paquete : min
          );

          if (paqueteMasBarato.count > 1) {
            // Si el paquete tiene más de 1, reducimos su count y creamos uno con promo
            paqueteMasBarato.count -= 1;
            paqueteMasBarato.price =
              (paqueteMasBarato.price / (paqueteMasBarato.count + 1)) * paqueteMasBarato.count;
            nuevosPaquetes.push({
              ...paqueteMasBarato,
              count: 1,
              oldPrice: paqueteMasBarato.price / 4,
              price: 0, // Precio 0 para paquetes con promo
              promo: true,
            });

            restante--;
          } else {
            // Si el paquete tiene count === 1, lo marcamos como promo
            const index = nuevosPaquetes.findIndex((paquete) => paquete === paqueteMasBarato);
            nuevosPaquetes[index] = {
              ...paqueteMasBarato,
              price: 0, // Precio 0 para paquetes con promo
              promo: true,
            };

            // Remover de paquetesPorSeccion para no procesarlo nuevamente
            const seccionIndex = paquetesPorSeccion.findIndex(
              (paquete) => paquete === paqueteMasBarato
            );
            paquetesPorSeccion.splice(seccionIndex, 1);
            restante--;
          }
        }
      }
    }
  });

  // Actualiza el estado solo si es necesario
  if (activarFamilyPlan) {
    setFamilyPlan(true);
    if (isChecked) {
      setPaquetesSeleccionados(nuevosPaquetes);
      setFlag(false);
    }
  } else {
    setFamilyPlan(false);
    setIsChecked(false);
  }
};

export const scrollToSection = () => {
  document.getElementById("busqueda").scrollIntoView({ behavior: "smooth" });
};
