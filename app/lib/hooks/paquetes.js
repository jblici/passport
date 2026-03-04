"use client";
import { useState, useEffect } from "react";

const useAlojamientos = () => {
  const [paquetes, setPaquetes] = useState(null);
  const [reglas, setReglas] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función genérica para obtener datos desde una hoja de cálculo
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

      return text
        .split("\n")
        .slice(1)
        .filter(row => row.trim()) // Filter empty rows
        .map((row, index) => {
          const cols = row.split(",");

          // Validate minimum columns
          if (cols.length < 17) {
            console.warn(`Row ${index + 1} has insufficient columns (${cols.length}/17), skipping`);
            return null;
          }

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
          ] = cols;

          return {
            id: index + 1,
            cerro: cerro?.trim() || "",
            hotel: hotel?.trim() || "",
            week: week?.trim() || "",
            habitacion: habitacion?.trim() || "",
            fechaInicio: fechaInicio?.trim() || "",
            fechaFinal: fechaFinal?.trim() || "",
            personas: Number(personas) || 0,
            precio: Number(Math.round(precio)) || 0,
            precioMenor: Number(Math.round(precioMenor)) || 0,
            moneda: moneda?.trim() || "",
            camaExtra: camaExtra?.trim() || "",
            extraMayor: Number(Math.round(extraMayor)) || 0,
            extraMenor: Number(Math.round(extraMenor)) || 0,
            minNoches: Number(minNoches) || 0,
            desayuno: desayuno?.trim() || "",
            tarifa: tarifa?.trim() || "",
            fechaVigencia: fechaVigencia?.trim() || "",
          };
        })
        .filter(row => row !== null); // Remove invalid rows
    } catch (err) {
      console.error("Error fetching CSV:", err);
      throw err;
    }
  };

  const fetchReglas = async (url) => {
    try {
      const response = await fetch(url, { redirect: "follow" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch rules from ${url}`);
      }
      const text = await response.text();

      if (!text || text.trim().length === 0) {
        throw new Error("Rules CSV file is empty");
      }

      return text
        .split("\n")
        .slice(1) // Skip header row
        .filter(row => row.trim()) // Filter empty rows
        .map((row, index) => {
          const columns = row.split(",");

          // Validate minimum columns
          if (columns.length < 2) {
            console.warn(`Rules row ${index + 1} has insufficient columns, skipping`);
            return null;
          }

          const hotel = columns[0]?.trim();
          const traduccion = columns[1]?.trim();

          return { hotel, traduccion };
        })
        .filter((row) => row !== null && row.hotel && row.traduccion); // Filter invalid rows
    } catch (err) {
      console.error("Error fetching rules:", err);
      throw err;
    }
  };

  const obtenerAlojamientos = async () => {
    try {
      setError(null);
      setLoading(true);

      const centros = [
        {
          nombre: "Las Leñas",
          paquetesUrl:
            "https://docs.google.com/spreadsheets/d/e/2PACX-1vT-gGbA9MsMsA-hsqYrvM8-icwqvPPQjMmvpAg3ArQmxQLwZShRw24K0uw5Y4Ot5cMItedJm-txLNfU/pub?gid=0&output=csv",
          reglasUrl:
            "https://docs.google.com/spreadsheets/d/e/2PACX-1vQzJo7lxeJJWTziphdCL_J1e_oBJdGFxAIJ6fU2qWTekLAuHW60pt_hwtfifRHktxKTqGSAzCG-WBZJ/pub?gid=1338090560&output=csv",
        },
        {
          nombre: "Cerro Castor",
          paquetesUrl:
            "https://docs.google.com/spreadsheets/d/e/2PACX-1vTpZ6k2LPvKfrbjyCt00zTrD8ItDGYgzpQwIlHuFaBV-40ogah_HYEpYxBWG3Ue66u4KfFEyhFBHhqT/pub?gid=0&output=csv",
          reglasUrl:
            "https://docs.google.com/spreadsheets/d/e/2PACX-1vTpZ6k2LPvKfrbjyCt00zTrD8ItDGYgzpQwIlHuFaBV-40ogah_HYEpYxBWG3Ue66u4KfFEyhFBHhqT/pub?gid=395989538&output=csv",
        },
        {
          nombre: "Catedral",
          paquetesUrl:
            "https://docs.google.com/spreadsheets/d/e/2PACX-1vSrgSNgmR8oRvUSBWiPH7971xx2p37mw1w958m0T0PwR6yNiEO3c1PaDWTSjkaAgyz4sJfYfwM8_i5v/pub?gid=0&output=csv",
          reglasUrl:
            "https://docs.google.com/spreadsheets/d/e/2PACX-1vSrgSNgmR8oRvUSBWiPH7971xx2p37mw1w958m0T0PwR6yNiEO3c1PaDWTSjkaAgyz4sJfYfwM8_i5v/pub?gid=395989538&output=csv",
        },
        {
          nombre: "Chapelco",
          paquetesUrl:
            "https://docs.google.com/spreadsheets/d/e/2PACX-1vTv5Ek5FqxuWJf8cu6C1BBMp8EIpuFKZy8yIv--8JKkhcbiB-rGEPiw2YfgJF9CvF3PSKla1JXSygPu/pub?gid=0&output=csv",
          reglasUrl:
            "https://docs.google.com/spreadsheets/d/e/2PACX-1vTv5Ek5FqxuWJf8cu6C1BBMp8EIpuFKZy8yIv--8JKkhcbiB-rGEPiw2YfgJF9CvF3PSKla1JXSygPu/pub?gid=395989538&output=csv",
        },
        {
          nombre: "Caviahue",
          paquetesUrl:
            "https://docs.google.com/spreadsheets/d/e/2PACX-1vRxALEm1jwR3vFdfnJc-0XaURWP3lOlfRLsSkrbFnMuH-WpLrOdu0QrgLF5FrZ9kXzad1yHPsSUSJTQ/pub?gid=0&output=csv",
          reglasUrl:
            "https://docs.google.com/spreadsheets/d/e/2PACX-1vRxALEm1jwR3vFdfnJc-0XaURWP3lOlfRLsSkrbFnMuH-WpLrOdu0QrgLF5FrZ9kXzad1yHPsSUSJTQ/pub?gid=1466940355&output=csv",
        },
      ];

      const [datosPaquetes, datosReglas] = await Promise.all([
        Promise.all(centros.map(async ({ paquetesUrl }) => await fetchCSV(paquetesUrl))),
        Promise.all(centros.map(async ({ reglasUrl }) => await fetchReglas(reglasUrl))),
      ]);

      setPaquetes(datosPaquetes.flat());
      setReglas(datosReglas.flat());
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error loading accommodations";
      console.error("Error in obtenerAlojamientos:", errorMessage);
      setError(errorMessage);
      setPaquetes([]);
      setReglas(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerAlojamientos();
  }, []);

  return { paquetes, reglas, error, loading };
};

export default useAlojamientos;
