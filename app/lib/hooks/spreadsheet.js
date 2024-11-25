"use client";
import { useState, useEffect } from "react";

const useSpeadsheets = () => {
  const [paquetes, setPaquetes] = useState(null);
  const [rentals, setRentals] = useState(null);
  const [clases, setClases] = useState(null);
  const [pases, setPases] = useState(null);
  const [traslado, setTraslado] = useState(null);

  const obtenerDatos = async () => {
    const csv = await fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQzJo7lxeJJWTziphdCL_J1e_oBJdGFxAIJ6fU2qWTekLAuHW60pt_hwtfifRHktxKTqGSAzCG-WBZJ/pub?output=csv"
    ).then((res) => res.text());
    const paquetes = csv
      .split("\n")
      .slice(1)
      .map((row, index) => {
        const [
          provincia,
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
          provincia,
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

    const csv2 = await fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQzJo7lxeJJWTziphdCL_J1e_oBJdGFxAIJ6fU2qWTekLAuHW60pt_hwtfifRHktxKTqGSAzCG-WBZJ/pub?gid=1647426432&single=true&output=csv"
    ).then((res) => res.text());

    const rentals = csv2
      .split("\n")
      .slice(1)
      .map((row) => {
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
        ] = row.split(",");
        return {
          cerro,
          local,
          temporada,
          edad,
          gama,
          articulo,
          fechaInicio,
          fechaFinal,
          dias: Number(dias),
          precio: Number(Math.round(precio)),
        };
      });

    const csv3 = await fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQzJo7lxeJJWTziphdCL_J1e_oBJdGFxAIJ6fU2qWTekLAuHW60pt_hwtfifRHktxKTqGSAzCG-WBZJ/pub?gid=1901056977&single=true&output=csv"
    ).then((res) => res.text());

    const clases = csv3
      .split("\n")
      .slice(1)
      .map((row) => {
        const [
          cerro,
          temporada,
          tipo,
          edad,
          edad2,
          fechaInicio,
          fechaFinal,
          pack,
          dias,
          precio,
          descripcion
        ] = row.split(",");
        return {
          cerro,
          temporada,
          tipo,
          edad,
          edad2,
          fechaInicio,
          fechaFinal,
          pack,
          dias: Number(dias),
          precio: Number(Math.round(precio)),
          descripcion
        };
      });
    const csv4 = await fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQzJo7lxeJJWTziphdCL_J1e_oBJdGFxAIJ6fU2qWTekLAuHW60pt_hwtfifRHktxKTqGSAzCG-WBZJ/pub?gid=371646853&single=true&output=csv"
    ).then((res) => res.text());

    const pases = csv4
      .split("\n")
      .slice(1)
      .map((row) => {
        const [cerro, temporada, edad, tipo, fechaInicio, fechaFinal, dias, precio, pack] =
          row.split(",");
        return {
          cerro,
          temporada,
          edad,
          tipo,
          fechaInicio,
          fechaFinal,
          dias,
          precio: Number(Math.round(precio)),
          pack,
        };
      });
    const csv5 = await fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQzJo7lxeJJWTziphdCL_J1e_oBJdGFxAIJ6fU2qWTekLAuHW60pt_hwtfifRHktxKTqGSAzCG-WBZJ/pub?gid=1978072612&single=true&output=csv"
    ).then((res) => res.text());

    const traslado = csv5
      .split("\n")
      .slice(1)
      .map((row) => {
        const [cerro, recorrido, servicio, tramo, precio, personas] = row.split(",");
        return {
          cerro,
          recorrido,
          servicio,
          tramo,
          precio: Number(Math.round(precio)),
          personas,
        };
      });

    setPaquetes(paquetes);
    setRentals(rentals);
    setClases(clases);
    setPases(pases);
    setTraslado(traslado);
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  return {
    paquetes,
    rentals,
    clases,
    pases,
    traslado,
  };
};

export default useSpeadsheets;
