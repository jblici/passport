"use client";
import { useState, useEffect } from "react";
import {
  fetchCSV,
  parseCSV,
  validateColumns,
  trimColumns,
  toNumber,
  toRoundedNumber,
  splitCSVRow,
} from "@/app/lib/utils/csvParser";
import { getAllPaqueteConfigs } from "@/app/lib/config/spreadsheetConfig";

const useAlojamientos = () => {
  const [paquetes, setPaquetes] = useState(null);
  const [reglas, setReglas] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const paquetesMapper = (row) => {
    const cols = splitCSVRow(row);
    validateColumns(cols, 18, "Paquetes row");

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
      maxNoches,
    ] = trimColumns(cols);

    return {
      cerro,
      hotel,
      week,
      habitacion,
      fechaInicio,
      fechaFinal,
      personas: toNumber(personas),
      precio: toRoundedNumber(precio),
      precioMenor: toRoundedNumber(precioMenor),
      moneda,
      camaExtra,
      extraMayor: toRoundedNumber(extraMayor),
      extraMenor: toRoundedNumber(extraMenor),
      minNoches: toNumber(minNoches),
      desayuno,
      tarifa,
      fechaVigencia,
      maxNoches: toNumber(maxNoches),
    };
  };

  const reglasMapper = (row) => {
    const columns = splitCSVRow(row);
    if (columns.length < 2) return null; // fila vacía o separador, ignorar

    const [hotel, traduccion] = trimColumns(columns);
    if (!hotel || !traduccion) return null; // fila incompleta, ignorar

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
            return parseCSV(csv, paquetesMapper);
          }),
        ),
        Promise.all(
          centros.map(async ({ reglasUrl }) => {
            const csv = await fetchCSV(reglasUrl);
            return parseCSV(csv, reglasMapper);
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
