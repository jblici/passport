import { stringDate } from "./extras";

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
    paquetesFiltrados = paquetesFiltrados.filter(
      (paquete) => paquete.week.toLowerCase() === producto.toLowerCase()
    );

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
      //console.log(cantidadNoches);
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
              // Detectar si este es el último paquete en la combinación posible
              const esUltimoPaquete =
                j === paquetess.length - 1 || parseDate(paquetess[j + 1]?.fechaInicio) > fin;

              const esCombinacionMultiple = combinacionActual.length > 0 || !esUltimoPaquete;

              let noches;

              if (esCombinacionMultiple) {
                // Lógica para combinaciones múltiples
                if (esUltimoPaquete) {
                  // Último paquete: no contar la noche de salida
                  noches = calcularDiferenciaDias(
                    Math.max(paqueteInicio, fechaContinua),
                    Math.min(paqueteFin, fin)
                  );
                } else {
                  // Paquete intermedio: contar noche de salida también
                  const finIncluido = new Date(Math.min(paqueteFin, fin) + 1000 * 60 * 60 * 24);
                  noches = calcularDiferenciaDias(
                    Math.max(paqueteInicio, fechaContinua),
                    finIncluido
                  );
                }
              } else {
                // Lógica normal para un solo paquete
                noches = calcularDiferenciaDias(
                  Math.max(paqueteInicio, fechaContinua),
                  Math.min(paqueteFin, fin)
                );
              }

              //console.log(noches);

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

  return ordenarResultadoPorMonedaYPrecio(resultados);
}

//CALCULAR HABITACIONES

export function calcularTotalPersonas(detalleHabitaciones) {
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

export function calcularNochesHotel(checkIn, checkOut) {
  const diff = Math.floor((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

//FORMATEAR FECHAS

export function parseDate(dateString) {
  const parts = dateString.split("/");
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Los meses en JavaScript son 0-indexados
  const year = parseInt(parts[2], 10);
  return new Date(year, month, day);
}

//CALCULO DE NOCHES ENTRE LAS DOS FECHAS SELECCIONADAS

export function calcularDiferenciaDias(fechaInicio, fechaFin) {
  const unDia = 1000 * 60 * 60 * 24;
  return Math.ceil((fechaFin - fechaInicio) / unDia);
}

export function calcularDiferenciaDiasProducto(producto) {
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

function ordenarResultadoPorMonedaYPrecio(resultado) {
  // Función auxiliar para obtener la moneda del paquete
  const obtenerMoneda = (item) => {
    const paquetesUtilizados = item.paquetesUtilizados;
    if (!paquetesUtilizados) return "ZZZ"; // En caso de que no haya info
    const paquete = Array.isArray(paquetesUtilizados.paquetes)
      ? paquetesUtilizados.paquetes[0]
      : paquetesUtilizados;

    return paquete?.moneda || "ZZZ"; // Si no hay moneda, va al final
  };

  // Función para obtener el orden de moneda (ARS primero, luego USD)
  const prioridadMoneda = (moneda) => {
    if (moneda === "ARS") return 0;
    if (moneda === "USD") return 1;
    return 2; // Cualquier otra moneda va después
  };

  // Creamos un nuevo objeto ordenado
  const resultadoOrdenado = {};

  Object.keys(resultado).forEach((habitacionKey) => {
    const arrayHabitacion = resultado[habitacionKey];

    const ordenado = arrayHabitacion.sort((a, b) => {
      const monedaA = obtenerMoneda(a);
      const monedaB = obtenerMoneda(b);

      const prioridadA = prioridadMoneda(monedaA);
      const prioridadB = prioridadMoneda(monedaB);

      if (prioridadA !== prioridadB) {
        return prioridadA - prioridadB;
      }

      return a.precioTotal - b.precioTotal;
    });

    resultadoOrdenado[habitacionKey] = ordenado;
  });

  return resultadoOrdenado;
}
