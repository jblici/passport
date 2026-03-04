"use client";
import { useState, useEffect } from "react";

const useGroupedSpreadsheets = () => {
  const [pases, setPases] = useState(null);
  const [clases, setClases] = useState(null);
  const [rentals, setRentals] = useState(null);
  const [traslados, setTraslados] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCSV = async (url) => {
    try {
      const response = await fetch(url, { redirect: "follow" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch ${url}`);
      }
      const text = await response.text();

      if (!text || text.trim().length === 0) {
        throw new Error("CSV file is empty");
      }

      return text;
    } catch (err) {
      console.error("Error fetching CSV:", err);
      throw err;
    }
  };

  const parseCSV = (csv, mapper) => {
    try {
      return csv
        .split("\n")
        .slice(1)
        .filter(row => row.trim())
        .map((row, index) => {
          try {
            return mapper(row);
          } catch (err) {
            console.warn(`Error parsing row ${index + 1}:`, err);
            return null;
          }
        })
        .filter(row => row !== null);
    } catch (err) {
      console.error("Error in parseCSV:", err);
      throw err;
    }
  };

  const obtenerDatos = async () => {
    try {
      setError(null);
      setLoading(true);

      // URLs de los distintos archivos
      const urls = {
      pases: [
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vQzJo7lxeJJWTziphdCL_J1e_oBJdGFxAIJ6fU2qWTekLAuHW60pt_hwtfifRHktxKTqGSAzCG-WBZJ/pub?gid=371646853&output=csv",
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vTpZ6k2LPvKfrbjyCt00zTrD8ItDGYgzpQwIlHuFaBV-40ogah_HYEpYxBWG3Ue66u4KfFEyhFBHhqT/pub?gid=1775784558&output=csv",
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vSrgSNgmR8oRvUSBWiPH7971xx2p37mw1w958m0T0PwR6yNiEO3c1PaDWTSjkaAgyz4sJfYfwM8_i5v/pub?gid=1775784558&output=csv",
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vTv5Ek5FqxuWJf8cu6C1BBMp8EIpuFKZy8yIv--8JKkhcbiB-rGEPiw2YfgJF9CvF3PSKla1JXSygPu/pub?gid=1775784558&output=csv",
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vRxALEm1jwR3vFdfnJc-0XaURWP3lOlfRLsSkrbFnMuH-WpLrOdu0QrgLF5FrZ9kXzad1yHPsSUSJTQ/pub?gid=438579692&output=csv",
      ],
      clases: [
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vQzJo7lxeJJWTziphdCL_J1e_oBJdGFxAIJ6fU2qWTekLAuHW60pt_hwtfifRHktxKTqGSAzCG-WBZJ/pub?gid=1901056977&output=csv",
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vTpZ6k2LPvKfrbjyCt00zTrD8ItDGYgzpQwIlHuFaBV-40ogah_HYEpYxBWG3Ue66u4KfFEyhFBHhqT/pub?gid=1969468282&output=csv",
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vSrgSNgmR8oRvUSBWiPH7971xx2p37mw1w958m0T0PwR6yNiEO3c1PaDWTSjkaAgyz4sJfYfwM8_i5v/pub?gid=1969468282&output=csv",
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vTv5Ek5FqxuWJf8cu6C1BBMp8EIpuFKZy8yIv--8JKkhcbiB-rGEPiw2YfgJF9CvF3PSKla1JXSygPu/pub?gid=1969468282&output=csv",
      ],
      rentals: [
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vQzJo7lxeJJWTziphdCL_J1e_oBJdGFxAIJ6fU2qWTekLAuHW60pt_hwtfifRHktxKTqGSAzCG-WBZJ/pub?gid=1647426432&output=csv",
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vTpZ6k2LPvKfrbjyCt00zTrD8ItDGYgzpQwIlHuFaBV-40ogah_HYEpYxBWG3Ue66u4KfFEyhFBHhqT/pub?gid=1939040620&output=csv",
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vSrgSNgmR8oRvUSBWiPH7971xx2p37mw1w958m0T0PwR6yNiEO3c1PaDWTSjkaAgyz4sJfYfwM8_i5v/pub?gid=1939040620&output=csv",
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vTv5Ek5FqxuWJf8cu6C1BBMp8EIpuFKZy8yIv--8JKkhcbiB-rGEPiw2YfgJF9CvF3PSKla1JXSygPu/pub?gid=1939040620&output=csv",
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vRxALEm1jwR3vFdfnJc-0XaURWP3lOlfRLsSkrbFnMuH-WpLrOdu0QrgLF5FrZ9kXzad1yHPsSUSJTQ/pub?gid=1693469524&output=csv",
      ],
      traslados: [
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vQzJo7lxeJJWTziphdCL_J1e_oBJdGFxAIJ6fU2qWTekLAuHW60pt_hwtfifRHktxKTqGSAzCG-WBZJ/pub?gid=1978072612&output=csv",
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vTpZ6k2LPvKfrbjyCt00zTrD8ItDGYgzpQwIlHuFaBV-40ogah_HYEpYxBWG3Ue66u4KfFEyhFBHhqT/pub?gid=1194478962&output=csv",
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vSrgSNgmR8oRvUSBWiPH7971xx2p37mw1w958m0T0PwR6yNiEO3c1PaDWTSjkaAgyz4sJfYfwM8_i5v/pub?gid=1194478962&output=csv",
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vTv5Ek5FqxuWJf8cu6C1BBMp8EIpuFKZy8yIv--8JKkhcbiB-rGEPiw2YfgJF9CvF3PSKla1JXSygPu/pub?gid=1194478962&output=csv",
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vRxALEm1jwR3vFdfnJc-0XaURWP3lOlfRLsSkrbFnMuH-WpLrOdu0QrgLF5FrZ9kXzad1yHPsSUSJTQ/pub?gid=324871885&output=csv",
      ],
    };

    // Mapeo de cada tipo de datos
    const mappers = {
      pases: (row) => {
        const cols = row.split(",");
        if (cols.length < 9) {
          throw new Error(`Pases row has insufficient columns (${cols.length}/9)`);
        }
        const [cerro, temporada, edad, tipo, fechaInicio, fechaFinal, dias, precio, pack] = cols;
        return {
          cerro: cerro?.trim() || "",
          temporada: temporada?.trim() || "",
          edad: edad?.trim() || "",
          tipo: tipo?.trim() || "",
          fechaInicio: fechaInicio?.trim() || "",
          fechaFinal: fechaFinal?.trim() || "",
          dias: Number(dias) || 0,
          precio: Number(precio) || 0,
          pack: pack?.trim() || "",
        };
      },
      clases: (row) => {
        const cols = row.split(",");
        if (cols.length < 11) {
          throw new Error(`Clases row has insufficient columns (${cols.length}/11)`);
        }
        const [
          cerro,
          temporada,
          tipo,
          edad,
          fechaInicio,
          fechaFinal,
          pack,
          dias,
          precio,
          descripcion,
        ] = cols;
        return {
          cerro: cerro?.trim() || "",
          temporada: temporada?.trim() || "",
          tipo: tipo?.trim() || "",
          edad: edad?.trim() || "",
          fechaInicio: fechaInicio?.trim() || "",
          fechaFinal: fechaFinal?.trim() || "",
          pack: pack?.trim() || "",
          dias: Number(dias) || 0,
          precio: Number(precio) || 0,
          descripcion: descripcion?.trim() || "",
        };
      },
      rentals: (row) => {
        const cols = row.split(",");
        if (cols.length < 10) {
          throw new Error(`Rentals row has insufficient columns (${cols.length}/10)`);
        }
        const [
          cerro,
          local,
          temporada,
          edad,
          gama,
          articulo,
          fechaInicio,
          fechaFinal,
          dias,
          precio,
        ] = cols;
        return {
          cerro: cerro?.trim() || "",
          local: local?.trim() || "",
          temporada: temporada?.trim() || "",
          edad: edad?.trim() || "",
          gama: gama?.trim() || "",
          articulo: articulo?.trim() || "",
          fechaInicio: fechaInicio?.trim() || "",
          fechaFinal: fechaFinal?.trim() || "",
          dias: Number(dias) || 0,
          precio: Number(precio) || 0,
        };
      },
      traslados: (row) => {
        const cols = row.split(",");
        if (cols.length < 11) {
          throw new Error(`Traslados row has insufficient columns (${cols.length}/11)`);
        }
        const [
          cerro,
          recorrido,
          origen,
          destino,
          servicio,
          descripcion,
          tramo,
          fechaInicio,
          fechaFinal,
          precio,
          personas,
        ] = cols;
        return {
          cerro: cerro?.trim() || "",
          recorrido: recorrido?.trim() || "",
          origen: origen?.trim() || "",
          destino: destino?.trim() || "",
          servicio: servicio?.trim() || "",
          descripcion: descripcion?.trim() || "",
          tramo: tramo?.trim() || "",
          fechaInicio: fechaInicio?.trim() || "",
          fechaFinal: fechaFinal?.trim() || "",
          precio: Number(precio) || 0,
          personas: Number(personas) || 0,
        };
      },
    };

    // Cargar datos de cada sección
    const data = {};
    for (const section in urls) {
      const csvData = await Promise.all(urls[section].map(fetchCSV));
      data[section] = csvData.flatMap((csv) => parseCSV(csv, mappers[section]));
    }

      setPases(data.pases);
      setClases(data.clases);
      setRentals(data.rentals);
      setTraslados(data.traslados);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error loading spreadsheet data";
      console.error("Error in obtenerDatos:", errorMessage);
      setError(errorMessage);
      setPases(null);
      setClases(null);
      setRentals(null);
      setTraslados(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  return {
    rentals,
    pases,
    clases,
    traslados,
    error,
    loading,
  };
};

export default useGroupedSpreadsheets;
