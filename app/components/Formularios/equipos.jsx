"use client";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { CalendarDaysIcon } from "../svg/svg";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { handleEquipos, scrollToSection } from "@/app/lib/utils";
import { GoAlert } from "react-icons/go";

const cerrosInfo = {
  Castor: {
    mensaje: (
      <>
        <span>Junior: 0 a 11 años.</span>
        <span>Adulto: 12 a 69 años.</span>
      </>
    ),
    gama: (
      <SelectContent>
        <SelectItem value="JUNIOR">Junior</SelectItem>
        <SelectItem value="ADULTO STANDARD">Adulto Standard</SelectItem>
        <SelectItem value="ADULTO GAMA ALTA">Adulto Gama Alta</SelectItem>
        <SelectItem value="ADULTO PREMIUM">Adulto Premium</SelectItem>
        <SelectItem value="ADULTO SKI GAMA ALTA">Adulto Ski Gama Alta</SelectItem>
        <SelectItem value="ADULTO SKI PREMIUM">Adulto Ski Premium</SelectItem>
      </SelectContent>
    ),
  },
  "Las Leñas": {
    gama: (
      <SelectContent>
        <SelectItem value="SPORT">Sport</SelectItem>
        <SelectItem value="ALTA GAMA">Alta Gama</SelectItem>
      </SelectContent>
    ),
  },
};

export default function Equipos({
  category,
  equipos,
  setEquipos,
  cerro,
  setCerro,
  startDate,
  setStartDate,
}) {
  const [dias, setDias] = useState("1");
  const [gama, setGama] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const currentYear = new Date().getFullYear();

  // Define los límites de fecha
  const minDate = new Date(currentYear, 5, 1); // Junio (mes 5 porque es basado en 0)
  const maxDate = new Date(currentYear, 9, 31); // Octubre

  useEffect(() => {}, [equipos]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEquipos(cerro, equipos, setEquipos, startDate, Number(dias), gama);
  };

  const handleGama = (value) => {
    setGama(value);
  };

  const handleDias = (value) => {
    setDias(value);
  };

  const handleCerro = (value) => {
    setCerro(value);
  };

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
                  <SelectItem value="Catedral">Catedral</SelectItem>
                  <SelectItem value="Chapelco">Chapelco</SelectItem>
                  <SelectItem value="Castor">Castor</SelectItem>
                  <SelectItem value="Las Leñas">Las Leñas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-2 w-full sm:w-1/2 justify-between">
              <Label htmlFor="gama">Gama:</Label>
              <Select id="gama" onValueChange={handleGama}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar Gama" />
                </SelectTrigger>
                {cerrosInfo[cerro]?.gama && cerrosInfo[cerro]?.gama}
              </Select>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <div className="flex flex-col space-y-2 w-full sm:w-1/2 justify-between">
              <Label htmlFor="start-date">
                <span className="flex items-center gap-1">
                  <CalendarDaysIcon /> Fecha de Inicio:
                </span>
              </Label>
              <DatePicker
                selected={startDate}
                minDate={minDate}
                maxDate={maxDate}
                dateFormat="dd/MM/yyyy"
                onChange={(date) => setStartDate(date)}
                className="w-full p-2 border rounded"
                withPortal
                placeholderText="Seleccionar fecha"
              />
            </div>
            <div className="flex flex-col space-y-2 w-full sm:w-1/2 justify-between">
              <Label htmlFor="dias">Dias:</Label>
              <Select id="dias" onValueChange={handleDias}>
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
          <div className="flex justify-between w-full">
            <div className="flex w-fit">
              <Button
                type="submit"
                className="w-full bg-blue-500 text-white hover:bg-blue-600"
                onClick={scrollToSection}
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
