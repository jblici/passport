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
        // En Castor, diferenciar por descripción en lugar de cantidad de personas
        if (cerro === "Castor") {
          transporteFiltrado = transporteFiltrado.filter(
            (paquete) =>
              paquete.descripcion.toLowerCase().includes("privado") ||
              paquete.descripcion.toLowerCase().includes("privada")
          );
        } else {
          transporteFiltrado = transporteFiltrado.filter((paquete) => paquete.personas > 1);
        }
      } else {
        if (cerro === "Castor") {
          // Filtrar público en Castor excluyendo paquetes con "privado" o "privada" en la descripción
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

    // Filtrar por cantidad de personas si está definido
    if (personas) {
      transporteFiltrado = transporteFiltrado.filter((paquete) => paquete.personas >= personas);
    }

    // Agregar las fechas de inicio y fin
    transporteFiltrado = transporteFiltrado.map((paquete) => ({
      ...paquete,
      inicio,
      fin,
    }));

    console.log(transporteFiltrado);

    // Dividir en secciones de ida y vuelta
    ida = transporteFiltrado.filter((paquete) => paquete.tramo === "Ida");
    vuelta = transporteFiltrado.filter((paquete) => paquete.tramo === "Vuelta");

    if (ida.length === 0 || vuelta.length === 0) {
      setTraslado(transporteFiltrado);
    } else {
      setTraslado({ ida, vuelta });
    }
  }
};
