"use client";
import { useState, useEffect } from "react";

const useGroupedSpreadsheets = () => {
  const [pases, setPases] = useState(null);
  const [clases, setClases] = useState(null);
  const [rentals, setRentals] = useState(null);
  const [traslados, setTraslados] = useState(null);

  const fetchCSV = async (url) => {
    const response = await fetch(url);
    return response.text();
  };

  const parseCSV = (csv, mapper) => {
    return csv.split("\n").slice(1).map(mapper);
  };

  const obtenerDatos = async () => {
    // URLs de los distintos archivos
    const urls = {
      pases: [
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vQzJo7lxeJJWTziphdCL_J1e_oBJdGFxAIJ6fU2qWTekLAuHW60pt_hwtfifRHktxKTqGSAzCG-WBZJ/pub?gid=371646853&single=true&output=csv",
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vTpZ6k2LPvKfrbjyCt00zTrD8ItDGYgzpQwIlHuFaBV-40ogah_HYEpYxBWG3Ue66u4KfFEyhFBHhqT/pub?gid=1775784558&single=true&output=csv",
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vSrgSNgmR8oRvUSBWiPH7971xx2p37mw1w958m0T0PwR6yNiEO3c1PaDWTSjkaAgyz4sJfYfwM8_i5v/pub?gid=1775784558&single=true&output=csv",
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vTv5Ek5FqxuWJf8cu6C1BBMp8EIpuFKZy8yIv--8JKkhcbiB-rGEPiw2YfgJF9CvF3PSKla1JXSygPu/pub?gid=1775784558&single=true&output=csv"
      ],
      clases: [
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vQzJo7lxeJJWTziphdCL_J1e_oBJdGFxAIJ6fU2qWTekLAuHW60pt_hwtfifRHktxKTqGSAzCG-WBZJ/pub?gid=1901056977&single=true&output=csv",
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vTpZ6k2LPvKfrbjyCt00zTrD8ItDGYgzpQwIlHuFaBV-40ogah_HYEpYxBWG3Ue66u4KfFEyhFBHhqT/pub?gid=1969468282&single=true&output=csv",
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vSrgSNgmR8oRvUSBWiPH7971xx2p37mw1w958m0T0PwR6yNiEO3c1PaDWTSjkaAgyz4sJfYfwM8_i5v/pub?gid=1969468282&single=true&output=csv",
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vTv5Ek5FqxuWJf8cu6C1BBMp8EIpuFKZy8yIv--8JKkhcbiB-rGEPiw2YfgJF9CvF3PSKla1JXSygPu/pub?gid=1969468282&single=true&output=csv"
      ],
      rentals: [
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vQzJo7lxeJJWTziphdCL_J1e_oBJdGFxAIJ6fU2qWTekLAuHW60pt_hwtfifRHktxKTqGSAzCG-WBZJ/pub?gid=1647426432&single=true&output=csv",
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vTpZ6k2LPvKfrbjyCt00zTrD8ItDGYgzpQwIlHuFaBV-40ogah_HYEpYxBWG3Ue66u4KfFEyhFBHhqT/pub?gid=1939040620&single=true&output=csv",
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vSrgSNgmR8oRvUSBWiPH7971xx2p37mw1w958m0T0PwR6yNiEO3c1PaDWTSjkaAgyz4sJfYfwM8_i5v/pub?gid=1939040620&single=true&output=csv",
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vTv5Ek5FqxuWJf8cu6C1BBMp8EIpuFKZy8yIv--8JKkhcbiB-rGEPiw2YfgJF9CvF3PSKla1JXSygPu/pub?gid=1939040620&single=true&output=csv"
      ],
      traslados: [
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vQzJo7lxeJJWTziphdCL_J1e_oBJdGFxAIJ6fU2qWTekLAuHW60pt_hwtfifRHktxKTqGSAzCG-WBZJ/pub?gid=1978072612&single=true&output=csv",
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vTpZ6k2LPvKfrbjyCt00zTrD8ItDGYgzpQwIlHuFaBV-40ogah_HYEpYxBWG3Ue66u4KfFEyhFBHhqT/pub?gid=1194478962&single=true&output=csv",
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vSrgSNgmR8oRvUSBWiPH7971xx2p37mw1w958m0T0PwR6yNiEO3c1PaDWTSjkaAgyz4sJfYfwM8_i5v/pub?gid=1194478962&single=true&output=csv",
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vTv5Ek5FqxuWJf8cu6C1BBMp8EIpuFKZy8yIv--8JKkhcbiB-rGEPiw2YfgJF9CvF3PSKla1JXSygPu/pub?gid=1194478962&single=true&output=csv"
      ]
    };

    // Mapeo de cada tipo de datos
    const mappers = {
      pases: (row) => {
        const [cerro, temporada, edad, tipo, fechaInicio, fechaFinal, dias, precio, pack] = row.split(",");
        return { cerro, temporada, edad, tipo, fechaInicio, fechaFinal, dias, precio: Number(precio), pack };
      },
      clases: (row) => {
        const [cerro,	temporada,	tipo,	edad,	edad2,	fechaInicio,	fechaFinal,	pack,	dias,	precio,	descripcion] = row.split(",");
        return { cerro, temporada, tipo, edad, fechaInicio, fechaFinal, pack, dias: Number(dias), precio: Number(precio), descripcion };
      },
      rentals: (row) => {
        const [cerro, local, temporada, edad, gama, articulo, fechaInicio, fechaFinal, dias, precio] = row.split(",");
        return { cerro, local, temporada, edad, gama, articulo, fechaInicio, fechaFinal, dias: Number(dias), precio: Number(precio) };
      },
      traslados: (row) => {
        const [cerro, recorrido, origen, destino, servicio, descripcion, tramo, fechaInicio, fechaFinal, precio, personas] = row.split(",");
        return { cerro, recorrido, origen, destino, servicio, descripcion, tramo, fechaInicio, fechaFinal, precio: Number(precio), personas: Number(personas) };
      }
    };

    // Cargar datos de cada sección
    const data = {};
    for (const section in urls) {
      const csvData = await Promise.all(urls[section].map(fetchCSV));
      data[section] = csvData.flatMap(csv => parseCSV(csv, mappers[section]));
    }

    setPases(data.pases);
    setClases(data.clases);
    setRentals(data.rentals);
    setTraslados(data.traslados);
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  return {
    rentals,
    pases,
    clases,
    traslados,
  };
};

export default useGroupedSpreadsheets;