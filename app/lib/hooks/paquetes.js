"use client";
import { useState, useEffect } from "react";
import {
  fetchCSV,
  parseCSV,
  validateColumns,
  trimColumns,
  toNumber,
} from "@/app/lib/utils/csvParser";
import { getAllPaqueteConfigs } from "@/app/lib/config/spreadsheetConfig";

const useAlojamientos = () => {
  const [paquetes, setPaquetes] = useState(null);
  const [reglas, setReglas] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const paquetesMapper = (row) => {
    const cols = row.split(",");
    validateColumns(cols, 17, "Paquetes row");

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
    ] = trimColumns(cols);

    return {
      id: 1, // Will be set by parseCSV
      cerro,
      hotel,
      week,
      habitacion,
      fechaInicio,
      fechaFinal,
      personas: toNumber(personas),
      precio: Number(Math.round(precio)) || 0,
      precioMenor: Number(Math.round(precioMenor)) || 0,
      moneda,
      camaExtra,
      extraMayor: Number(Math.round(extraMayor)) || 0,
      extraMenor: Number(Math.round(extraMenor)) || 0,
      minNoches: toNumber(minNoches),
      desayuno,
      tarifa,
      fechaVigencia,
    };
  };

  const reglasMapper = (row) => {
    const columns = row.split(",");
    validateColumns(columns, 2, "Reglas row");

    const [hotel, traduccion] = trimColumns(columns);

    if (!hotel || !traduccion) {
      throw new Error("Hotel or traduccion is empty");
    }

    return { hotel, traduccion };
  };

  const obtenerAlojamientos = async () => {
    try {
      setError(null);
      setLoading(true);

      const centros = getAllPaqueteConfigs();

      const [datosPaquetes, datosReglas] = await Promise.all([
        Promise.all(
          centros.map(async ({ paquetesUrl }) => {
            const csv = await fetchCSV(paquetesUrl);
            return parseCSV(csv, paquetesMapper, 17);
          }),
        ),
        Promise.all(
          centros.map(async ({ reglasUrl }) => {
            const csv = await fetchCSV(reglasUrl);
            return parseCSV(csv, reglasMapper, 2);
          }),
        ),
      ]);

      // Add IDs to paquetes
      const paquetesWithIds = datosPaquetes.flat().map((p, idx) => ({
        ...p,
        id: idx + 1,
      }));

      setPaquetes(paquetesWithIds);
      setReglas(datosReglas.flat());
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error loading accommodations";
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
