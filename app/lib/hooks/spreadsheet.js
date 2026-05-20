"use client";
import { useState, useEffect } from "react";
import {
  fetchCSV,
  parseCSV,
  validateColumns,
  trimColumns,
  toNumber,
  splitCSVRow,
} from "@/app/lib/utils/csvParser";
import { SPREADSHEET_URLS } from "@/app/lib/config/spreadsheetConfig";

const mappers = {
    pases: (row) => {
      const cols = splitCSVRow(row);
      validateColumns(cols, 9, "Pases row");
      const [cerro, temporada, edad, tipo, fechaInicio, fechaFinal, dias, precio, pack] =
        trimColumns(cols);
      return {
        cerro,
        temporada,
        edad,
        tipo,
        fechaInicio,
        fechaFinal,
        dias: toNumber(dias),
        precio: toNumber(precio),
        pack,
      };
    },
    clases: (row) => {
      const cols = splitCSVRow(row);
      validateColumns(cols, 11, "Clases row");
      const [
        cerro,
        temporada,
        tipo,
        edad,
        , // edad2 — present in sheet but not used
        fechaInicio,
        fechaFinal,
        pack,
        dias,
        precio,
        descripcion,
      ] = trimColumns(cols);
      return {
        cerro,
        temporada,
        tipo,
        edad,
        fechaInicio,
        fechaFinal,
        pack,
        dias: toNumber(dias),
        precio: toNumber(precio),
        descripcion,
      };
    },
    rentals: (row) => {
      const cols = splitCSVRow(row);
      validateColumns(cols, 10, "Rentals row");
      const [cerro, local, temporada, edad, gama, articulo, fechaInicio, fechaFinal, dias, precio] =
        trimColumns(cols);
      return {
        cerro,
        local,
        temporada,
        edad,
        gama,
        articulo,
        fechaInicio,
        fechaFinal,
        dias: toNumber(dias),
        precio: toNumber(precio),
      };
    },
    traslados: (row) => {
      const cols = splitCSVRow(row);
      validateColumns(cols, 11, "Traslados row");
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
      ] = trimColumns(cols);
      return {
        cerro,
        recorrido,
        origen,
        destino,
        servicio,
        descripcion,
        tramo,
        fechaInicio,
        fechaFinal,
        precio: toNumber(precio),
        personas: toNumber(personas),
      };
    },
};

const useGroupedSpreadsheets = () => {
  const [pases, setPases] = useState(null);
  const [clases, setClases] = useState(null);
  const [rentals, setRentals] = useState(null);
  const [traslados, setTraslados] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const obtenerDatos = async () => {
    try {
      setError(null);
      setLoading(true);

      const entries = await Promise.all(
        Object.entries(SPREADSHEET_URLS).map(async ([section, urls]) => {
          const csvData = await Promise.all(urls.map(fetchCSV));
          return [section, csvData.flatMap((csv) => parseCSV(csv, mappers[section]))];
        }),
      );
      const data = Object.fromEntries(entries);

      setPases(data.pases);
      setClases(data.clases);
      setRentals(data.rentals);
      setTraslados(data.traslados);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error loading spreadsheet data";
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
