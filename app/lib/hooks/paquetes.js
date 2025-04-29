"use client";
import { useState, useEffect } from "react";

const useAlojamientos = () => {
  const [paquetes, setPaquetes] = useState([]);
  const [reglas, setReglas] = useState(null);

  // Función genérica para obtener datos desde una hoja de cálculo
  const fetchCSV = async (url) => {
    const response = await fetch(url);
    const text = await response.text();
    return text
      .split("\n")
      .slice(1)
      .map((row, index) => {
        const [
          cerro,
          hotel,
          week,
          habitacion,
          fechaInicio,
          fechaFinal,
          personas,
          precio,
          precioMenor,
          moneda,
          camaExtra,
          extraMayor,
          extraMenor,
          minNoches,
          desayuno,
          tarifa,
          fechaVigencia,
        ] = row.split(",");

        return {
          id: index + 1,
          cerro: cerro,
          hotel,
          week,
          habitacion,
          fechaInicio,
          fechaFinal,
          personas: Number(personas),
          precio: Number(Math.round(precio)),
          precioMenor: Number(Math.round(precioMenor)),
          moneda,
          camaExtra,
          extraMayor: Number(Math.round(extraMayor)),
          extraMenor: Number(Math.round(extraMenor)),
          minNoches: Number(minNoches),
          desayuno,
          tarifa,
          fechaVigencia,
        };
      });
  };

  const fetchReglas = async (url) => {
    const response = await fetch(url);
    const text = await response.text();

    return text
      .split("\n")
      .slice(1) // Omitimos la primera fila (headers)
      .map((row) => {
        const columns = row.split(","); // Dividimos la fila en columnas
        const hotel = columns[0]?.trim(); // Primera columna (hotel)
        const traduccion = columns[1]?.trim(); // Segunda columna (traducción)

        return { hotel, traduccion };
      })
      .filter((row) => row.hotel && row.traduccion); // Filtramos posibles filas vacías
  };

  const obtenerAlojamientos = async () => {
    const centros = [
      {
        nombre: "Las Leñas",
        paquetesUrl:
          "https://docs.google.com/spreadsheets/d/e/2PACX-1vQzJo7lxeJJWTziphdCL_J1e_oBJdGFxAIJ6fU2qWTekLAuHW60pt_hwtfifRHktxKTqGSAzCG-WBZJ/pub?gid=0&single=true&output=csv",
        reglasUrl:
          "https://docs.google.com/spreadsheets/d/e/2PACX-1vQzJo7lxeJJWTziphdCL_J1e_oBJdGFxAIJ6fU2qWTekLAuHW60pt_hwtfifRHktxKTqGSAzCG-WBZJ/pub?gid=1338090560&single=true&output=csv",
      },
      {
        nombre: "Cerro Castor",
        paquetesUrl:
          "https://docs.google.com/spreadsheets/d/e/2PACX-1vTpZ6k2LPvKfrbjyCt00zTrD8ItDGYgzpQwIlHuFaBV-40ogah_HYEpYxBWG3Ue66u4KfFEyhFBHhqT/pub?gid=0&single=true&output=csv",
        reglasUrl:
          "https://docs.google.com/spreadsheets/d/e/2PACX-1vTpZ6k2LPvKfrbjyCt00zTrD8ItDGYgzpQwIlHuFaBV-40ogah_HYEpYxBWG3Ue66u4KfFEyhFBHhqT/pub?gid=395989538&single=true&output=csv",
      },
      {
        nombre: "Catedral",
        paquetesUrl:
          "https://docs.google.com/spreadsheets/d/e/2PACX-1vSrgSNgmR8oRvUSBWiPH7971xx2p37mw1w958m0T0PwR6yNiEO3c1PaDWTSjkaAgyz4sJfYfwM8_i5v/pub?gid=0&single=true&output=csv",
        reglasUrl:
          "https://docs.google.com/spreadsheets/d/e/2PACX-1vSrgSNgmR8oRvUSBWiPH7971xx2p37mw1w958m0T0PwR6yNiEO3c1PaDWTSjkaAgyz4sJfYfwM8_i5v/pub?gid=395989538&single=true&output=csv",
      },
      {
        nombre: "Chapelco",
        paquetesUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTv5Ek5FqxuWJf8cu6C1BBMp8EIpuFKZy8yIv--8JKkhcbiB-rGEPiw2YfgJF9CvF3PSKla1JXSygPu/pub?gid=0&single=true&output=csv",
        reglasUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTv5Ek5FqxuWJf8cu6C1BBMp8EIpuFKZy8yIv--8JKkhcbiB-rGEPiw2YfgJF9CvF3PSKla1JXSygPu/pub?gid=395989538&single=true&output=csv"
      }
      // Agrega aquí las URLs de los demás centros de ski
    ];

    const [datosPaquetes, datosReglas] = await Promise.all([
      Promise.all(centros.map(async ({ paquetesUrl }) => await fetchCSV(paquetesUrl))),
      Promise.all(centros.map(async ({ reglasUrl }) => await fetchReglas(reglasUrl))),
    ]);

    // Unir los datos en arrays planos
    setPaquetes(datosPaquetes.flat());
    setReglas(datosReglas.flat());
  };

  useEffect(() => {
    obtenerAlojamientos();
  }, []);

  return { paquetes, reglas };
};

export default useAlojamientos;
