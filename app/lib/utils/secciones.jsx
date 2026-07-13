import PaquetesHoteles from "../../components/Paquetes/hoteles";
import PaquetesEquipos from "../../components/Paquetes/equipos";
import PaquetesClases from "../../components/Paquetes/clases";
import PaquetesPases from "../../components/Paquetes/pases";
import PaquetesTransporte from "../../components/Paquetes/transporte";
import Equipos from "../../components/Formularios/equipos";
import Clases from "../../components/Formularios/clases";
import Pases from "../../components/Formularios/pases";
import Transporte from "../../components/Formularios/transporte";
import Hoteles from "../../components/Formularios/hoteles";
import { sumarDias } from "./extras";
import { parseDate } from "./hoteles";

// --- Helpers de filtrado por fechas ---

const filterByDateOverlap = (items, startDate, fechaFin) =>
  items.filter((item) => {
    const inicio = parseDate(item.fechaInicio);
    const fin = parseDate(item.fechaFinal);
    return (
      (inicio <= startDate && startDate <= fin) ||
      (inicio <= fechaFin && fechaFin <= fin) ||
      (startDate <= inicio && fechaFin >= fin)
    );
  });

const filterByStartDate = (items, startDate) =>
  items.filter((item) => {
    const inicio = parseDate(item.fechaInicio);
    const fin = parseDate(item.fechaFinal);
    return inicio <= startDate && startDate <= fin;
  });

const calcularTotalPorDia = (items, startDate, dias) => {
  const diasSeleccionados = Array.from({ length: dias }, (_, i) =>
    sumarDias(new Date(startDate), i)
  );
  let total = 0;
  let paqueteRef = null;
  diasSeleccionados.forEach((fecha) => {
    const item = items.find((i) => {
      const inicio = parseDate(i.fechaInicio);
      const fin = parseDate(i.fechaFinal);
      return fecha >= inicio && fecha <= fin;
    });
    if (item) {
      total += Number(item.precio) / dias;
      if (!paqueteRef) paqueteRef = item;
    }
  });
  return [{ precio: total, paquete: paqueteRef }];
};

const matchesDias = (item, dias) =>
  dias === 1 ? Number(item.dias) <= 1 : Number(item.dias) === dias;

const eqCI = (a, b) => a?.toUpperCase() === b?.toUpperCase();

export const handleBusqueda = (
  category,
  hotelSearchResults,
  passSearchResults,
  classSearchResults,
  transferSearchResults,
  equipmentSearchResults,
  agregarPaquete,
  reglas
) => {
  if (category === "Equipos") {
    if (!equipmentSearchResults) return null;
    return <PaquetesEquipos resultados={equipmentSearchResults} agregarPaquete={agregarPaquete} />;
  } else if (category === "Clases") {
    if (!classSearchResults) return null;
    return <PaquetesClases resultados={classSearchResults} agregarPaquete={agregarPaquete} />;
  } else if (category === "Medios de Elevación") {
    if (!passSearchResults) return null;
    return <PaquetesPases resultados={passSearchResults} agregarPaquete={agregarPaquete} />;
  } else if (category === "Transporte") {
    if (!transferSearchResults) return null;
    return <PaquetesTransporte resultados={transferSearchResults} agregarPaquete={agregarPaquete} />;
  } else if (category === "Alojamientos") {
    if (!hotelSearchResults) return null;
    return (
      <PaquetesHoteles resultados={hotelSearchResults} agregarPaquete={agregarPaquete} reglas={reglas} />
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
  setHotelSearchResults,
  setEquipmentSearchResults,
  setPassSearchResults,
  setClassSearchResults,
  setTransferSearchResults,
  cerro,
  setCerro,
  setBusqueda,
  startDate,
  setStartDate
) => {
  if (category === "Equipos") {
    return (
      <Equipos
        category={category}
        equipos={rentals}
        setEquipos={setEquipmentSearchResults}
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
        setClases={setClassSearchResults}
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
        setPases={setPassSearchResults}
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
        setTraslado={setTransferSearchResults}
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
        setHoteles={setHotelSearchResults}
        cerro={cerro}
        setCerro={setCerro}
        setBusqueda={setBusqueda}
        startDate={startDate}
        setStartDate={setStartDate}
      />
    );
  }
};

export const handleEquipos = (cerro, rentals, setEquipos, startDate, dias, gama) => {
  let rentalsFiltradas = rentals;

  if (cerro) {
    rentalsFiltradas = rentalsFiltradas.filter((rental) => eqCI(rental.cerro, cerro));
  }

  if (gama) {
    rentalsFiltradas = rentalsFiltradas.filter((rental) => eqCI(rental.gama, gama));
  }

  if (dias) {
    rentalsFiltradas = rentalsFiltradas.filter((rental) => matchesDias(rental, dias));
  }

  if (cerro === "Castor" || cerro === "Chapelco") {
    const fechaFin = sumarDias(new Date(startDate), dias - 1);
    rentalsFiltradas = filterByDateOverlap(rentalsFiltradas, startDate, fechaFin);
    setEquipos(calcularTotalPorDia(rentalsFiltradas, startDate, dias));
  } else {
    if (startDate && dias) {
      rentalsFiltradas = filterByStartDate(rentalsFiltradas, startDate);
    }
    setEquipos(rentalsFiltradas.sort((a, b) => a.precio - b.precio));
  }
};

export const handleClases = (cerro, clases, setClases, startDate, dias, tipo) => {
  let clasesFiltradas = clases;

  if (cerro) {
    clasesFiltradas = clasesFiltradas.filter((clase) => eqCI(clase.cerro, cerro));
  }

  if (tipo) {
    clasesFiltradas = clasesFiltradas.filter((clase) => eqCI(clase.tipo, tipo));
  }

  if (dias) {
    clasesFiltradas = clasesFiltradas.filter((clase) => matchesDias(clase, dias));
  }

  if (cerro === "Chapelco") {
    const fechaFin = sumarDias(new Date(startDate), dias - 1);
    clasesFiltradas = filterByDateOverlap(clasesFiltradas, startDate, fechaFin);
    setClases(calcularTotalPorDia(clasesFiltradas, startDate, dias));
  } else {
    if (startDate && dias) {
      clasesFiltradas = filterByStartDate(clasesFiltradas, startDate);
    }
    setClases(clasesFiltradas.sort((a, b) => a.precio - b.precio));
  }
};

export const handlePases = (cerro, pases, setPases, startDate, dias, tipo) => {
  let pasesFiltrados = pases;

  if (cerro) {
    pasesFiltrados = pasesFiltrados.filter((pase) => eqCI(pase.cerro, cerro));
  }

  if (tipo) {
    if (cerro === "Chapelco") {
      if (eqCI(tipo, "FLEXIBLE")) {
        pasesFiltrados = pasesFiltrados.filter((pase) =>
          pase.tipo.toUpperCase().includes("FLEXIBLE")
        );
      } else if (eqCI(tipo, "NORMAL")) {
        pasesFiltrados = pasesFiltrados.filter(
          (pase) => !pase.tipo.toUpperCase().includes("FLEXIBLE")
        );
      }
    } else {
      pasesFiltrados = pasesFiltrados.filter((pase) => eqCI(pase.tipo, tipo));
    }
  }

  // Catedral: planilla solo tiene filas con dias=1 (pase diario).
  // Precio total = precio_diario × días solicitados.
  if (cerro === "Catedral") {
    pasesFiltrados = pasesFiltrados.filter((pase) => Number(pase.dias) === 1);
    if (startDate) {
      pasesFiltrados = filterByStartDate(pasesFiltrados, startDate);
    }
    const resultado = pasesFiltrados.map((pase) => ({
      ...pase,
      precio: Number(pase.precio) * dias,
      dias,
    }));
    setPases(resultado.sort((a, b) => a.precio - b.precio));
    return;
  }

  if (dias) {
    pasesFiltrados = pasesFiltrados.filter((pase) => matchesDias(pase, dias));
  }

  if (cerro === "Castor" || cerro === "Chapelco" || cerro === "Caviahue") {
    const fechaFin = sumarDias(new Date(startDate), dias - 1);
    pasesFiltrados = filterByDateOverlap(pasesFiltrados, startDate, fechaFin);

    // Group by edad (age-specific pass pricing)
    const gruposPorEdad = pasesFiltrados.reduce((acc, paquete) => {
      const key = paquete.edad || "default";
      if (!acc[key]) acc[key] = [];
      acc[key].push(paquete);
      return acc;
    }, {});

    const resultado = Object.values(gruposPorEdad)
      .filter((grupo) => grupo.length > 0)
      .map((grupo) => calcularTotalPorDia(grupo, startDate, dias)[0]);

    setPases(resultado);
  } else {
    if (startDate && dias) {
      pasesFiltrados = filterByStartDate(pasesFiltrados, startDate);
    }
    setPases(pasesFiltrados.sort((a, b) => a.precio - b.precio));
  }
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
  const inicio = new Date(startDate).toLocaleDateString("es-AR");
  const fin = new Date(endDate).toLocaleDateString("es-AR");

  if (cerro) {
    transporteFiltrado = transporteFiltrado.filter((paquete) => eqCI(paquete.cerro, cerro));
  }

  if (startDate && endDate) {
    transporteFiltrado = filterByStartDate(transporteFiltrado, startDate);
  }

  if (tipoTransporte === "Pasaje") {
    transporteFiltrado = transporteFiltrado.filter((paquete) => paquete.servicio === "Pasaje");
    transporteFiltrado = transporteFiltrado.map((paquete) => ({ ...paquete, inicio, fin }));
    setTraslado(transporteFiltrado);
  } else if (tipoTransporte === "Transfer") {
    if (claseTransporte) {
      if (claseTransporte === "Privado") {
        if (cerro === "Castor" || cerro === "Chapelco") {
          transporteFiltrado = transporteFiltrado.filter(
            (paquete) =>
              paquete.descripcion.toLowerCase().includes("privado") ||
              paquete.descripcion.toLowerCase().includes("privada")
          );
        } else {
          transporteFiltrado = transporteFiltrado.filter((paquete) => paquete.personas > 1);
        }
      } else {
        if (cerro === "Castor" || cerro === "Chapelco") {
          transporteFiltrado = transporteFiltrado.filter(
            (paquete) =>
              !paquete.descripcion.toLowerCase().includes("privado") &&
              !paquete.descripcion.toLowerCase().includes("privada")
          );
        } else {
          transporteFiltrado = transporteFiltrado.filter((paquete) => paquete.personas === 1);
        }
      }
    }

    if (personas) {
      transporteFiltrado = transporteFiltrado.filter((paquete) => paquete.personas >= personas);
    }

    transporteFiltrado = transporteFiltrado.map((paquete) => ({ ...paquete, inicio, fin }));

    const byTramo = transporteFiltrado.reduce(
      (acc, p) => {
        if (p.tramo === "Ida") acc.ida.push(p);
        else if (p.tramo === "Vuelta") acc.vuelta.push(p);
        else if (p.tramo === "Ida y Vuelta") acc.idayvuelta.push(p);
        return acc;
      },
      { ida: [], vuelta: [], idayvuelta: [] }
    );

    if (byTramo.ida.length === 0 || byTramo.vuelta.length === 0) {
      setTraslado(transporteFiltrado.sort((a, b) => a.personas - b.personas));
    } else {
      const sort = (arr) => arr.sort((a, b) => a.personas - b.personas);
      setTraslado({ ida: sort(byTramo.ida), vuelta: sort(byTramo.vuelta), idayvuelta: sort(byTramo.idayvuelta) });
    }
  }
};
