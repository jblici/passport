import { stringDate, sumarDias } from "./extras";

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
    setHoteles(busquedaHoteles);
  } catch (error) {
    console.error(error);
  }
};

// Shared by Las Leñas and non-Las Leñas branches.
function calcularPrecioHabitacion(paquete, mayores, menores, total) {
  if (paquete.personas === total - 1 && paquete.camaExtra === "Si") {
    // Extra bed: minor gets it if present, otherwise an adult does
    if (menores > 0) {
      return (
        paquete.extraMenor +
        (paquete.precioMenor ? paquete.precioMenor * (menores - 1) : paquete.precio * (menores - 1)) +
        paquete.precio * mayores
      );
    } else {
      return paquete.extraMayor + paquete.precio * (mayores - 1);
    }
  }
  return (
    paquete.precio * mayores +
    (paquete.precioMenor ? paquete.precioMenor * menores : paquete.precio * menores)
  );
}

function calcularHoteles(
  startDate,
  endDate,
  cerro,
  paquetes,
  hotelSeleccionado,
  producto,
  totalPersonas
) {
  const inicio = startDate instanceof Date ? startDate : new Date(startDate);
  const fin = endDate instanceof Date ? endDate : new Date(endDate);
  let resultados = {};
  let paquetesFiltrados = paquetes;

  if (cerro) {
    const cerroCI = cerro.toUpperCase();
    paquetesFiltrados = paquetesFiltrados.filter((paquete) => paquete.cerro?.toUpperCase() === cerroCI);
  }

  if (hotelSeleccionado.length > 0) {
    paquetesFiltrados = paquetesFiltrados.filter((paquete) =>
      hotelSeleccionado.includes(paquete.hotel)
    );
  }

  if (cerro === "Las Leñas" && producto) {
    const noches = calcularDiferenciaDiasProducto(producto);
    const fechaFin = sumarDias(startDate, noches);

    paquetesFiltrados = paquetesFiltrados.filter(
      (paquete) => paquete.week.toLowerCase() === producto.toLowerCase()
    );

    paquetesFiltrados = paquetesFiltrados.filter((paquete) => paquete.minNoches <= noches);

    const startDateNormalized = normalizeDate(startDate);
    paquetesFiltrados = paquetesFiltrados.filter((paquete) => {
      const fechaInicio = parseDate(paquete.fechaInicio);
      const fechaFinal = parseDate(paquete.fechaFinal);
      return startDateNormalized >= fechaInicio && startDateNormalized <= fechaFinal;
    });

    totalPersonas.habitaciones.forEach((habitacion, index) => {
      const { mayores, menores, total } = habitacion;

      const paquetesPorHabitacion = paquetesFiltrados.filter(
        (paquete) =>
          paquete.personas === total ||
          (paquete.personas === total - 1 && paquete.camaExtra === "Si")
      );

      paquetesPorHabitacion.forEach((paquete) => {
        const habitacionKey = `Habitacion ${index + 1}`;
        if (!resultados[habitacionKey]) resultados[habitacionKey] = [];

        resultados[habitacionKey].push({
          id: index + paquete.id + 1,
          totalPersonas: total,
          mayores,
          menores,
          noches,
          precioTotal: calcularPrecioHabitacion(paquete, mayores, menores, total),
          paquetesUtilizados: paquete,
          fechaInicio: stringDate(startDate),
          fechaFinal: stringDate(fechaFin),
        });
      });
    });
  } else {
    let resultadoIdCounter = 1;
    const cantidadNoches = calcularDiferenciaDias(inicio, fin);
    paquetesFiltrados = paquetesFiltrados.filter((paquete) => paquete.minNoches <= cantidadNoches);

    totalPersonas.habitaciones.forEach((habitacion, index) => {
      const { mayores, menores, total } = habitacion;
      const paquetesPorHabitacion = {};

      const paquetesHabitacion = paquetesFiltrados.filter(
        (paquete) =>
          paquete.personas === total ||
          (paquete.personas === total - 1 && paquete.camaExtra === "Si")
      );

      const habitacionKey = `Habitacion ${index + 1}`;
      if (!resultados[habitacionKey]) resultados[habitacionKey] = [];

      paquetesHabitacion.forEach((paquete) => {
        const clave = `${paquete.hotel}-${paquete.habitacion}-${paquete.personas}-${
          paquete.tarifa ?? ""
        }`;
        if (!paquetesPorHabitacion[clave]) paquetesPorHabitacion[clave] = [];
        paquetesPorHabitacion[clave].push(paquete);
      });

      for (const clave in paquetesPorHabitacion) {
        const grupo = paquetesPorHabitacion[clave];
        grupo.sort((a, b) => parseDate(a.fechaInicio) - parseDate(b.fechaInicio));

        for (let i = 0; i < grupo.length; i++) {
          const combinacionActual = [];
          let totalNoches = 0;
          let totalPrecio = 0;
          let fechaContinua = inicio;

          for (let j = i; j < grupo.length; j++) {
            const paquete = grupo[j];
            const paqueteInicio = parseDate(paquete.fechaInicio);
            const paqueteFin = parseDate(paquete.fechaFinal);

            if (paqueteInicio <= fechaContinua && paqueteFin >= fechaContinua) {
              const esUltimoPaquete =
                j === grupo.length - 1 || parseDate(grupo[j + 1]?.fechaInicio) > fin;

              const esCombinacionMultiple = combinacionActual.length > 0 || !esUltimoPaquete;

              let noches;
              if (esCombinacionMultiple) {
                if (esUltimoPaquete) {
                  noches = calcularDiferenciaDias(
                    Math.max(paqueteInicio, fechaContinua),
                    Math.min(paqueteFin, fin)
                  );
                } else {
                  const finIncluido = new Date(Math.min(paqueteFin, fin) + 1000 * 60 * 60 * 24);
                  noches = calcularDiferenciaDias(
                    Math.max(paqueteInicio, fechaContinua),
                    finIncluido
                  );
                }
              } else {
                noches = calcularDiferenciaDias(
                  Math.max(paqueteInicio, fechaContinua),
                  Math.min(paqueteFin, fin)
                );
              }

              if (cerro === "Castor" || cerro === "Caviahue" || cerro === "Chapelco" || cerro === "Catedral") {
                totalPrecio += noches * calcularPrecioHabitacion(paquete, mayores, menores, total);
              } else {
                totalPrecio += noches * (paquete.precio * total);
              }
              totalNoches += noches;

              combinacionActual.push({ ...paquete });

              fechaContinua = sumarDias(paqueteFin, 1);

              const combinacionInicio = parseDate(combinacionActual[0].fechaInicio);
              const combinacionFin = parseDate(
                combinacionActual[combinacionActual.length - 1].fechaFinal
              );

              if (combinacionInicio <= inicio && combinacionFin >= fin) {
                resultados[habitacionKey].push({
                  id: resultadoIdCounter++,
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
                break;
              }
            } else {
              break;
            }
          }
        }
      }
    });
  }

  if (Object.keys(resultados).length === 0) {
    throw new Error("No se encontraron paquetes continuos que cubran las fechas seleccionadas.");
  }

  return ordenarResultadoPorMonedaYPrecio(resultados);
}

export function calcularTotalPersonas(detalleHabitaciones) {
  const resultado = { total: 0, habitaciones: [] };
  let totalMayoresCombinado = 0;
  let totalMenoresCombinado = 0;

  detalleHabitaciones.forEach((habitacion) => {
    const mayores = Number(habitacion.mayores) || 0;
    const menores = Number(habitacion.menores) || 0;
    const totalPersonas = mayores + menores;

    resultado.total += totalPersonas;
    totalMayoresCombinado += mayores;
    totalMenoresCombinado += menores;

    resultado.habitaciones.push({ total: totalPersonas, mayores, menores });
  });

  if (detalleHabitaciones.length > 1) {
    resultado.habitaciones.push({
      total: totalMayoresCombinado + totalMenoresCombinado,
      mayores: totalMayoresCombinado,
      menores: totalMenoresCombinado,
    });
  }

  return resultado;
}


export function parseDate(dateString) {
  const parts = dateString.split("/");
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  // Midnight local time to avoid UTC-3 timezone offset
  return new Date(year, month, day);
}

// Normalizes any Date to local midnight for consistent comparison with parseDate
export function normalizeDate(date) {
  if (!date) return null;
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function calcularDiferenciaDias(fechaInicio, fechaFin) {
  const unDia = 1000 * 60 * 60 * 24;
  return Math.ceil((fechaFin - fechaInicio) / unDia);
}

const PRODUCT_DAYS = { MiniWeek: 2, ExtraWeek: 5, SkiWeek: 7 };
export function calcularDiferenciaDiasProducto(producto) {
  return PRODUCT_DAYS[producto] ?? 0;
}

function ordenarResultadoPorMonedaYPrecio(resultado) {
  const obtenerMoneda = (item) => {
    const pu = item.paquetesUtilizados;
    if (!pu) return "ZZZ";
    const paquete = Array.isArray(pu.paquetes) ? pu.paquetes[0] : pu;
    return paquete?.moneda || "ZZZ";
  };

  const prioridadMoneda = (moneda) => {
    if (moneda === "ARS") return 0;
    if (moneda === "USD") return 1;
    return 2;
  };

  const resultadoOrdenado = {};
  Object.keys(resultado).forEach((habitacionKey) => {
    resultadoOrdenado[habitacionKey] = resultado[habitacionKey].sort((a, b) => {
      const pa = prioridadMoneda(obtenerMoneda(a));
      const pb = prioridadMoneda(obtenerMoneda(b));
      return pa !== pb ? pa - pb : a.precioTotal - b.precioTotal;
    });
  });

  return resultadoOrdenado;
}
