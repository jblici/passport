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
          cerro,
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
      .slice(1)
      .map((row) => {
        // Dividir solo por la primera coma
        const [hotel, ...rest] = row.split(",");
        const descripcion = rest.join(","); // Reunir todo lo que está después de la primera coma
        return {
          hotel: hotel.trim(), // Limpiar espacios extra
          descripcion: descripcion.trim().replace(/\. /g, ".\n"), // Limpiar espacios extra
        };
      });
  };

  const obtenerAlojamientos = async () => {
    const centros = [
      {
        nombre: "Las Leñas",
        paquetesUrl:
          "https://docs.google.com/spreadsheets/d/e/2PACX-1vQzJo7lxeJJWTziphdCL_J1e_oBJdGFxAIJ6fU2qWTekLAuHW60pt_hwtfifRHktxKTqGSAzCG-WBZJ/pub?output=csv",
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
  });

  return { paquetes, reglas };
};

export default useAlojamientos;
