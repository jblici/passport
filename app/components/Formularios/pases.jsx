"use client";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { CalendarDaysIcon } from "../svg/svg";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { handlePases, scrollToSection } from "@/app/lib/utils";
import { GoAlert } from "react-icons/go";

const cerrosInfo = {
  "Las Leñas": {
    mensaje: (
      <>
        <span>Menores 3 a 5 años: NO abona medio de elevación</span>
        <span>Menores: 6 a 11 años</span>
        <span>Mayores: + 12 años</span>
        <span>+ 70 años: NO abona medio de elevación</span>
        <span>Principiantes: Válido para pistas Eros 1 y 2 y Venus 1 y 2</span>
      </>
    ),
  },
  Castor: {
    mensaje: (
      <>
        <span>Infantes: 0 a 4 años, pase sin cargo.</span>
        <span>Menor: 5 a 11 años.</span>
        <span>Adulto: 12 a 69 años.</span>
        <span>Senior: + 70 años, pase sin cargo.</span>
      </>
    ),
  },
  Catedral: {
    mensaje: (
      <>
        <span>Infante: de 3 a 5 años. Solo paga KeyCard.</span>
        <span>Menor: de 6 a 11 años</span>
        <span>Mayor: de 12 a 64 años.</span>
        <span>Senior: de 65 a 69 años.</span>
        <span>+ 70 AÑOS: Pase Free. Solo paga KeyCard.</span>
        <span>Todos los pases aplican costo retornable por KeyCard.</span>
      </>
    ),
    tipos: (
      <SelectContent>
        <SelectItem value="PASS PACK">Pass Pack</SelectItem>
        <SelectItem value="FLEXI PACK">Flexi Pack</SelectItem>
        <SelectItem value="EXCLUSIVE PACK">Exclusive Pack</SelectItem>
      </SelectContent>
    ),
  },
  Chapelco: {
    tipos: (
      <SelectContent>
        <SelectItem value="NORMAL">Normal</SelectItem>
        <SelectItem value="FLEXIBLE">Flexible</SelectItem>
      </SelectContent>
    ),
  },
};

export default function Pases({
  category,
  pases,
  setPases,
  cerro,
  setCerro,
  startDate,
  setStartDate,
}) {
  const [dias, setDias] = useState("1");
  const [tipo, setTipo] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const currentYear = new Date().getFullYear();

  // Define los límites de fecha
  const minDate = new Date(currentYear, 5, 1); // Junio (mes 5 porque es basado en 0)
  const maxDate = new Date(currentYear, 9, 31); // Octubre

  const handleSubmit = (e) => {
    e.preventDefault();
    handlePases(cerro, pases, setPases, startDate, Number(dias), tipo);
  };

  useEffect(() => {}, [pases]);

  const handleCerro = (value) => {
    setCerro(value);
  };

  const handleDias = (value) => {
    setDias(value);
  };

  const handleTipo = (value) => {
    setTipo(value);
  };

  useEffect(() => {
    console.log(pases);
    if (cerro && dias && startDate) {
      setDisabled(false);
    }
  }, [cerro, dias, startDate, pases]);

  return (
    <div className="h-fit w-full">
      <h1 className="flex justify-center p-2 text-2xl font-bold">{category}</h1>
      <div className="p-4 sm:p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <div className="flex flex-col space-y-2 w-full sm:w-1/2 justify-between">
              <Label htmlFor="centro">Centro:</Label>
              <Select id="centro" onValueChange={handleCerro} value={cerro}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar Centro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Catedral">Cerro Catedral</SelectItem>
                  <SelectItem value="Castor">Cerro Castor</SelectItem>
                  <SelectItem value="Chapelco">Chapelco</SelectItem>
                  <SelectItem value="Las Leñas">Valle de Las Leñas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-2 w-full sm:w-1/2 justify-between">
              <Label htmlFor="centro">Dias:</Label>
              <Select id="clase" onValueChange={handleDias}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar Dias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="7">7</SelectItem>
                  <SelectItem value="8">8</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <div
              className={`flex flex-col space-y-2 w-full sm:w-1/2 ${
                cerro === "Catedral" || cerro === "Chapelco" ? "" : "pr-2"
              }`}
            >
              <Label htmlFor="start-date">
                <span className="flex items-center gap-1">
                  <CalendarDaysIcon /> Fecha de Inicio:
                </span>
              </Label>
              <DatePicker
                selected={startDate}
                minDate={minDate}
                maxDate={maxDate}
                withPortal
                dateFormat="dd/MM/yyyy"
                onChange={(date) => setStartDate(date)}
                className="w-full p-2 border rounded"
                placeholderText="Seleccionar fecha"
              />
            </div>
            {(cerro === "Catedral" || cerro === "Chapelco") && (
              <div className="flex flex-col space-y-2 w-full sm:w-1/2 justify-between">
                <Label htmlFor="tipo">Pase:</Label>
                <Select id="tipo" onValueChange={handleTipo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar Pase" />
                    {cerrosInfo[cerro]?.tipos && cerrosInfo[cerro]?.tipos}
                  </SelectTrigger>
                </Select>
              </div>
            )}
          </div>
          <div className="flex justify-between w-full">
            <div className="flex w-fit relative">
              <Button
                type="submit"
                className="w-full bg-blue-500 text-white hover:bg-blue-600"
                onClick={scrollToSection}
                disabled={disabled}
              >
                Buscar
              </Button>
            </div>
            {cerrosInfo[cerro]?.mensaje && (
              <div className="flex border rounded-lg items-center gap-2 p-2 border-blue-200">
                <GoAlert className="animate-bounce text-blue-500" />
                <div className="text-xs text-gray-500 flex flex-col space-y-2 w-fit">
                  {cerrosInfo[cerro]?.mensaje}
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
