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

// EQUIPOS

export const handleEquipos = (cerro, rentals, setEquipos, startDate, dias, gama) => {
  let rentalsFiltradas = rentals;
  const fechaFin = sumarDias(new Date(startDate), dias - 1);
  console.log(rentalsFiltradas)

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
    rentalsFiltradas = rentalsFiltradas.filter((rental) =>
      dias === 1 ? Number(rental.dias) <= dias : Number(rental.dias) === dias
    );
  }

  // FILTRADO ESPECIAL PARA CASTOR y CHAPELCO
  if (cerro === "Castor" || cerro === "Chapelco") {
    rentalsFiltradas = rentalsFiltradas.filter((rental) => {
      const inicio = parseDate(rental.fechaInicio);
      const fin = parseDate(rental.fechaFinal);

      return (
        (inicio <= startDate && startDate <= fin) ||
        (inicio <= fechaFin && fechaFin <= fin) ||
        (startDate <= inicio && fechaFin >= fin)
      );
    });

    const diasSeleccionados = Array.from({ length: dias }, (_, i) =>
      sumarDias(new Date(startDate), i)
    );

    // No hay grupos por edad en rentals, se toma 1 paquete x día
    let total = 0;
    const paquete = [];

    diasSeleccionados.forEach((fecha) => {
      const paqueteDelDia = rentalsFiltradas.find((rental) => {
        const inicio = parseDate(rental.fechaInicio);
        const fin = parseDate(rental.fechaFinal);
        return fecha >= inicio && fecha <= fin;
      });
      if (paqueteDelDia) {
        total += Number(paqueteDelDia.precio) / dias;
        paquete.push(paqueteDelDia);
      }
    });

    setEquipos([
      {
        precio: total,
        paquete: paquete[0],
      },
    ]);
  } else {
    // Bariloche y Las Leñas funcionan como antes
    if (startDate && dias) {
      rentalsFiltradas = rentalsFiltradas.filter((rental) => {
        const inicio = parseDate(rental.fechaInicio);
        const fin = parseDate(rental.fechaFinal);
        if (cerro === "Las Leñas") {
          return inicio <= startDate && startDate <= fin;
        } else {
          return inicio <= startDate && inicio <= fechaFin;
        }
      });
    }
    setEquipos(rentalsFiltradas.sort((a, b) => a.precio - b.precio));
  }
};

// CLASES

export const handleClases = (cerro, clases, setClases, startDate, dias, tipo) => {
  let clasesFiltradas = clases;
  const fechaFin = sumarDias(new Date(startDate), dias - 1);

  if (cerro) {
    clasesFiltradas = clasesFiltradas.filter((clase) => clase.cerro === cerro);
  }

  if (tipo) {
    clasesFiltradas = clasesFiltradas.filter(
      (clase) => clase.tipo.toUpperCase() === tipo.toUpperCase()
    );
  }

  if (dias) {
    clasesFiltradas = clasesFiltradas.filter((clase) =>
      dias === 1 ? Number(clase.dias) <= dias : Number(clase.dias) === dias
    );
  }

  if (cerro === "Castor" || cerro === "Chapelco") {
    clasesFiltradas = clasesFiltradas.filter((clase) => {
      const inicio = parseDate(clase.fechaInicio);
      const fin = parseDate(clase.fechaFinal);
      return (
        (inicio <= startDate && startDate <= fin) ||
        (inicio <= fechaFin && fechaFin <= fin) ||
        (startDate <= inicio && fechaFin >= fin)
      );
    });

    const diasSeleccionados = Array.from({ length: dias }, (_, i) =>
      sumarDias(new Date(startDate), i)
    );

    let total = 0;
    const paquetes = [];

    diasSeleccionados.forEach((fecha) => {
      const paqueteDelDia = clasesFiltradas.find((clase) => {
        const inicio = parseDate(clase.fechaInicio);
        const fin = parseDate(clase.fechaFinal);
        return fecha >= inicio && fecha <= fin;
      });
      if (paqueteDelDia) {
        total += Number(paqueteDelDia.precio) / dias;
        paquetes.push(paqueteDelDia);
      }
    });

    setClases([
      {
        precio: total,
        paquete: paquetes[0],
      },
    ]);
  } else {
    if (startDate && dias) {
      clasesFiltradas = clasesFiltradas.filter((clase) => {
        const inicio = parseDate(clase.fechaInicio);
        const fin = parseDate(clase.fechaFinal);
        if (cerro === "Las Leñas") {
          return inicio <= startDate && startDate <= fin;
        } else {
          return inicio <= startDate && inicio <= fechaFin;
        }
      });
    }
    setClases(clasesFiltradas.sort((a, b) => a.precio - b.precio));
  }
};

// BUSQUEDA PASES

export const handlePases = (cerro, pases, setPases, startDate, dias, tipo) => {
  let pasesFiltrados = pases;
  const fechaFin = sumarDias(new Date(startDate), dias - 1);

  if (cerro) {
    pasesFiltrados = pasesFiltrados.filter(
      (pase) => pase.cerro.toUpperCase() === cerro.toUpperCase()
    );
  }

  if (tipo) {
    if (cerro === "Chapelco") {
      if (tipo.toUpperCase() === "FLEXIBLE") {
        pasesFiltrados = pasesFiltrados.filter((pase) =>
          pase.tipo.toUpperCase().includes("FLEXIBLE")
        );
      } else if (tipo.toUpperCase() === "NORMAL") {
        pasesFiltrados = pasesFiltrados.filter(
          (pase) => !pase.tipo.toUpperCase().includes("FLEXIBLE")
        );
      }
    } else {
      pasesFiltrados = pasesFiltrados.filter(
        (pase) => pase.tipo.toUpperCase() === tipo.toUpperCase()
      );
    }
  }

  if (dias) {
    pasesFiltrados = pasesFiltrados.filter((pase) =>
      dias === 1 ? Number(pase.dias) <= dias : Number(pase.dias) === dias
    );
  }

  if (cerro === "Castor" || cerro === "Chapelco") {
    pasesFiltrados = pasesFiltrados.filter((pase) => {
      const paseInicio = parseDate(pase.fechaInicio);
      const paseFinal = parseDate(pase.fechaFinal);

      return (
        (paseInicio <= startDate && startDate <= paseFinal) ||
        (paseInicio <= fechaFin && fechaFin <= paseFinal) ||
        (startDate <= paseInicio && fechaFin >= paseFinal)
      );
    });

    const diasSeleccionados = Array.from({ length: dias }, (_, i) =>
      sumarDias(new Date(startDate), i)
    );

    // Agrupar por edad
    const gruposPorEdad = pasesFiltrados.reduce((acc, paquete) => {
      const key = paquete.edad || "default";
      if (!acc[key]) acc[key] = [];
      acc[key].push(paquete);
      return acc;
    }, {});

    const resultado = [];

    Object.entries(gruposPorEdad).forEach(([edad, paquetes]) => {
      let total = 0;

      diasSeleccionados.forEach((fecha) => {
        const paqueteDelDia = paquetes.find((p) => {
          const inicio = parseDate(p.fechaInicio);
          const fin = parseDate(p.fechaFinal);
          return fecha >= inicio && fecha <= fin;
        });

        if (paqueteDelDia) {
          total += Number(paqueteDelDia.precio) / dias;
        }
      });

      if (paquetes.length > 0) {
        resultado.push({
          precio: total,
          paquete: paquetes[0], // usamos el primero como referencia
        });
      }
    });

    setPases(resultado);
  } else {
    if (startDate && dias) {
      pasesFiltrados = pasesFiltrados.filter((pase) => {
        const paseInicio = parseDate(pase.fechaInicio);
        const paseFinal = parseDate(pase.fechaFinal);

        console.log(startDate, fechaFin)

        if (cerro === "Las Leñas") {
          return paseInicio <= startDate && startDate <= paseFinal;
        } else {
          return paseInicio <= startDate && startDate <= paseFinal;
        }
      });

    }
    console.log(pasesFiltrados, "final");
    // Bariloche y Las Leñas funcionan como hasta ahora
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
  let ida = [];
  let vuelta = [];
  let idayvuelta = [];
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
    ida = transporteFiltrado
      .filter((paquete) => paquete.tramo === "Ida")
      .sort((a, b) => a.personas - b.personas);
    vuelta = transporteFiltrado
      .filter((paquete) => paquete.tramo === "Vuelta")
      .sort((a, b) => a.personas - b.personas);
    idayvuelta = transporteFiltrado
      .filter((paquete) => paquete.tramo === "Ida y Vuelta")
      .sort((a, b) => a.personas - b.personas);

    if (ida.length === 0 || vuelta.length === 0) {
      setTraslado(transporteFiltrado.sort((a, b) => a.personas - b.personas));
    } else {
      setTraslado({ ida, vuelta, idayvuelta });
    }
  }
};
