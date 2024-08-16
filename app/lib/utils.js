import jsPDF from "jspdf";
import PaquetesHoteles from "../components/ui/Paquetes/hoteles";
import PaquetesEquipos from "../components/ui/Paquetes/equipos";
import PaquetesClases from "../components/ui/Paquetes/clases";
import PaquetesPases from "../components/ui/Paquetes/pases";
import PaquetesTransporte from "../components/ui/Paquetes/transporte";
import Equipos from "../components/ui/Formularios/equipos";
import Clases from "../components/ui/Formularios/clases";
import Pases from "../components/ui/Formularios/pases";
import Transporte from "../components/ui/Formularios/transporte";
import Hoteles from "../components/ui/Formularios/hoteles";

export const generatePDF = (paquetesSeleccionados, totalCompra) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Presupuesto valido hasta Fecha X", 14, 22);

  doc.setFontSize(12);
  paquetesSeleccionados.forEach((paquete, index) => {
    doc.text(`${paquete.name}: $${paquete.price}`, 14, 30 + index * 10);
  });

  doc.setFontSize(16);
  doc.text(`Total: $${totalCompra}`, 14, 30 + paquetesSeleccionados.length * 10 + 10);

  doc.save("cotizacion.pdf");
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
    console.error(error.message);
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
  const resultados = [];
  const totales = [totalPersonas.total, ...totalPersonas.habitaciones.map((h) => h.total)];

  let paquetesFiltrados = paquetes.filter((paquete) => totales.includes(Number(paquete.personas)));

  if (cerro) {
    paquetesFiltrados = paquetesFiltrados.filter((paquete) => paquete.cerro === cerro);
  }

  if (hotelSeleccionado) {
    paquetesFiltrados = paquetesFiltrados.filter((paquete) => paquete.hotel === hotelSeleccionado);
  }

  // Filtrado adicional para "Las Leñas"
  if (cerro === "Las Leñas" && producto) {
    console.log("entre");
    paquetesFiltrados = paquetesFiltrados.filter((paquete) => paquete.week.includes(producto));
    paquetesFiltrados.forEach((paquete) => {
      const noches = calcularDiferenciaDiasProducto(inicio, producto);
      const totalPrecio = noches * paquete.precio;

      const resultado = {
        cerro: paquete.cerro,
        hotel: paquete.hotel,
        habitacion: paquete.habitacion,
        fechaInicio: paquete.fechaInicio,
        fechaFinal: paquete.fechaFinal || null,
        precio: paquete.precio,
        noches,
        personas: paquete.personas,
        precioPromedio: Math.round(totalPrecio / noches),
      };

      resultados.push({
        id: resultados.length + 1,
        total: totalPrecio,
        personas: paquete.personas,
        precioPromedio: Math.round(totalPrecio / noches),
        paquetesUtilizados: resultado,
      });
    });
  } else {
    // Agrupar paquetes por hotel, habitación y personas
    const paquetesPorHabitacion = {};
    paquetesFiltrados.forEach((paquete) => {
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
      const paquetes = paquetesPorHabitacion[clave];
      paquetes.sort((a, b) => parseDate(a.fechaInicio) - parseDate(b.fechaInicio));

      for (let i = 0; i < paquetes.length; i++) {
        const combinacionActual = [];
        let totalNoches = 0;
        let totalPrecio = 0;
        let fechaContinua = inicio;

        for (let j = i; j < paquetes.length; j++) {
          const paquete = paquetes[j];
          const paqueteInicio = parseDate(paquete.fechaInicio);
          const paqueteFin = parseDate(paquete.fechaFinal);

          // Verificar si el paquete es continuo con la última fecha de la combinación
          if (paqueteInicio <= fechaContinua && paqueteFin >= fechaContinua) {
            const noches = calcularDiferenciaDias(
              Math.max(paqueteInicio, fechaContinua),
              Math.min(paqueteFin, fin)
            );
            totalPrecio += noches * paquete.precio;
            totalNoches += noches;

            combinacionActual.push({
              cerro: paquete.cerro,
              hotel: paquete.hotel,
              habitacion: paquete.habitacion,
              fechaInicio: paquete.fechaInicio,
              fechaFinal: paquete.fechaFinal,
              precio: paquete.precio,
              noches,
            });

            // Actualizar la fecha continua
            fechaContinua = new Date(paqueteFin);
            fechaContinua.setDate(fechaContinua.getDate() + 1);

            const combinacionInicio = parseDate(combinacionActual[0].fechaInicio);
            const combinacionFin = parseDate(
              combinacionActual[combinacionActual.length - 1].fechaFinal
            );

            if (combinacionInicio <= inicio && combinacionFin >= fin) {
              resultados.push({
                id: i + j + 1,
                total: totalPrecio,
                personas: paquete.personas,
                precioPromedio: Math.round(totalPrecio / totalNoches),
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
  }

  if (resultados.length === 0) {
    throw new Error("No se encontraron paquetes continuos que cubran las fechas seleccionadas.");
  }

  const paquetePorTotal = {};

  totales.forEach((valor) => {
    const paquetes = resultados.filter((paquete) => Number(paquete.personas) === valor);
    paquetePorTotal[`total_${valor}`] = paquetes;
  });

  return paquetePorTotal;
}

//CALCULAR HABITACIONES

function calcularTotalPersonas(detalleHabitaciones) {
  const resultado = { total: 0, habitaciones: [] };

  detalleHabitaciones.forEach((habitacion, index) => {
    const mayores = Number(habitacion.mayores) || 0;
    const menores = Number(habitacion.menores) || 0;
    const totalPersonas = mayores + menores;

    resultado.total += totalPersonas;

    resultado.habitaciones.push({
      total: totalPersonas,
      mayores: mayores,
      menores: menores,
    });
  });

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
  return Math.ceil((fechaFin - fechaInicio) / unDia) + 1;
}

function calcularDiferenciaDiasProducto(fechaInicio, producto) {
  let diasASumar = 0;

  if (producto === "Miniweek") {
    diasASumar = 2;
  } else if (producto === "Week") {
    diasASumar = 5;
  } else if (producto === "Fullweek") {
    diasASumar = 7;
  }

  // Crear una nueva fecha sumando los días
  const fechaFin = new Date(fechaInicio);
  fechaFin.setDate(fechaFin.getDate() + diasASumar);

  const unDia = 1000 * 60 * 60 * 24;
  return Math.ceil((fechaFin - fechaInicio) / unDia);
}

//BUSQUEDA EQUIPOS

export const handleEquipos = (cerro, rentals, setEquipos, startDate, endDate) => {
  function parseDate2(dateStr) {
    return new Date(dateStr);
  }
  try {
    // Filtrar equipos por cerro
    let equiposFiltrados = rentals.filter((equipo) => !cerro || equipo.cerro === cerro);

    const equiposCombinados = [];

    equiposFiltrados.forEach((equipo, index) => {
      const equipoInicio = parseDate2(equipo.fechaInicio);
      const equipoFin = parseDate2(equipo.fechaFinal);

      // Verificar si el equipo cubre completamente las fechas seleccionadas
      if (equipoInicio <= startDate && equipoFin >= endDate) {
        equiposCombinados.push([equipo]);
      } else {
        // Buscar combinaciones de fechas continuas
        let combinacionActual = [equipo];
        let totalNoches = calcularDiferenciaDias(Math.max(equipoInicio, startDate), Math.min(equipoFin, endDate));

        for (let i = index + 1; i < equiposFiltrados.length; i++) {
          const siguienteEquipo = equiposFiltrados[i];
          const siguienteInicio = parseDate2(siguienteEquipo.fechaInicio);
          const siguienteFin = parseDate2(siguienteEquipo.fechaFinal);

          if (siguienteInicio <= equipoFin) {
            combinacionActual.push(siguienteEquipo);
            totalNoches += calcularDiferenciaDias(Math.max(siguienteInicio, startDate), Math.min(siguienteFin, endDate));
            
            // Si la combinación cubre completamente las fechas seleccionadas
            if (combinacionActual[0].fechaInicio <= startDate && siguienteFin >= endDate) {
              equiposCombinados.push(combinacionActual);
              break;
            }
          }
        }
      }
    });

    // Si no se encontró ninguna combinación que cubra las fechas seleccionadas
    if (equiposCombinados.length === 0) {
      throw new Error("No se encontraron equipos que cubran las fechas seleccionadas.");
    }

    setEquipos(equiposCombinados.flat());
  } catch (error) {
    console.error(error.message);
  }
};

export const handleClases = (cerro, clases, setClases, startDate, endDate) => {
  let clasesFiltradas = clases;
  if (cerro) {
    clasesFiltradas.filter((clase) => clase.cerro === cerro);
  }
  if (personas) {
    clasesFiltradas.filter((clase) => clase.personas === personas);
  }
  setClases(clasesFiltradas);
};

//BUSQUEDA PASES

export const handlePases = (cerro, pases, setPases, startDate, endDate) => {
  let pasesFiltrados = pases;
  if (cerro) {
    pasesFiltrados.filter((pase) => pase.cerro === cerro);
  }
  setPases(pasesFiltrados);
  return;
  const paquetesCombinados = [];

  pasesFiltrados.forEach((pase) => {
    const paseInicio = new Date(pase.fechaInicio);
    const paseFinal = new Date(pase.fechaFinal);

    if (fechaInicio >= paseInicio && fechaFinal <= paseFinal) {
      paquetesCombinados.push(pase);
    } else if (fechaInicio <= paseFinal && fechaFinal >= paseInicio) {
      const paquete1 = pasesFiltrados.find((p) => p.fechaFinal >= fechaInicio);
      const paquete2 = pasesFiltrados.find((p) => p.fechaInicio <= fechaFinal);

      if (paquete1 && paquete2 && paquete1 !== paquete2) {
        const totalPrecio =
          paquete1.precio * (paquete1.fechaFinal - fechaInicio) +
          paquete2.precio * (fechaFinal - paquete2.fechaInicio);
        const totalDias = paquete1.fechaFinal - fechaInicio + (fechaFinal - paquete2.fechaInicio);
        const precioPromedio = totalPrecio / totalDias;

        paquetesCombinados.push({
          ...paquete1,
          precio: precioPromedio,
          fechaInicio,
          fechaFinal,
        });
      }
    }
  });

  return paquetesCombinados;
};

export const handleTransporte = (cerro, traslado, setTraslado, startDate, endDate) => {
  let transporteFiltrado = traslado;
  if (cerro) {
    transporteFiltrado.filter((paquete) => paquete.cerro === cerro);
  }
  setTraslado(transporteFiltrado);
};

export const handleBusqueda = (
  category,
  resHoteles,
  resPases,
  resClases,
  resTraslado,
  resEquipos,
  agregarPaquete
) => {
  // Lógica para manejar la búsqueda basada en la categoría
  if (category === "Equipos") {
    if (!resEquipos) return null;
    return <PaquetesEquipos resultados={resEquipos} agregarPaquete={agregarPaquete} />;
  } else if (category === "Clases") {
    if (!resClases) return null;
    return <PaquetesClases resultados={resClases} agregarPaquete={agregarPaquete} />;
  } else if (category === "Pases") {
    if (!resPases) return null;
    return <PaquetesPases resultados={resPases} agregarPaquete={agregarPaquete} />;
  } else if (category === "Transporte") {
    if (!resTraslado) return null;
    return <PaquetesTransporte resultados={resTraslado} agregarPaquete={agregarPaquete} />;
  } else if (category === "Hoteles") {
    if (!resHoteles) return null;
    return <PaquetesHoteles resultados={resHoteles} agregarPaquete={agregarPaquete} />;
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
  setCerro
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
      />
    );
  } else if (category === "Pases") {
    return (
      <Pases
        category={category}
        pases={pases}
        setPases={setPases}
        cerro={cerro}
        setCerro={setCerro}
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
      />
    );
  } else if (category === "Hoteles") {
    return (
      <Hoteles
        category={category}
        paquetes={paquetes}
        setHoteles={setHoteles}
        cerro={cerro}
        setCerro={setCerro}
      />
    );
  }
};
