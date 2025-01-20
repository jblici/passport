"use client";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Label } from "../label";
import { Input } from "../input";
import { Button } from "../button";
import { CalendarDaysIcon } from "../../svg/svg";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";
import { handleTransporte, scrollToSection } from "@/app/lib/utils";
import ToggleYesNo from "../ToggleYesNo";

export default function Transporte({
  category,
  traslado,
  setTraslado,
  cerro,
  setCerro,
  startDate,
  setStartDate,
}) {
  const [endDate, setEndDate] = useState(startDate);
  const [personas, setPersonas] = useState(null);
  const [tipoTransporte, setTipoTransporte] = useState("Pasaje");
  const [claseTransporte, setClaseTransporte] = useState("Regular");
  const [disable, setDisable] = useState(true);
  const currentYear = new Date().getFullYear();

  // Define los límites de fecha
  const minDate = new Date(currentYear, 5, 1); // Junio (mes 5 porque es basado en 0)
  const maxDate = new Date(currentYear, 9, 31); // Octubre

  useEffect(() => {
    if (cerro && startDate && endDate) {
      setDisable(false);
    }
  }, [cerro, endDate, startDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleTransporte(
      cerro,
      traslado,
      setTraslado,
      startDate,
      endDate,
      tipoTransporte,
      claseTransporte,
      personas
    );
  };

  const handleCerro = (value) => {
    setCerro(value);
  };

  const handleTipoTransporte = (value) => {
    setTipoTransporte(value);
  };

  const handleClaseTransporte = (value) => {
    setClaseTransporte(value);
  };

  return (
    <div className="h-fit w-full">
      <h1 className="flex justify-center p-2 text-2xl font-bold">{category}</h1>
      <div className="p-4 sm:p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 w-full justify-center items-center">
            <div className="flex justify-center w-1/4">
              <ToggleYesNo
                onValueChange={handleTipoTransporte}
                options={[{ label: "Pasaje" }, { label: "Transfer" }]}
              />
            </div>
            {tipoTransporte === "Transfer" && (
              <div className="flex justify-center w-1/4">
                <ToggleYesNo
                  onValueChange={handleClaseTransporte}
                  options={[{ label: "Regular" }, { label: "Privado" }]}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <div
              className={`flex flex-col space-y-2 w-full sm:w-1/2 justify-between ${
                claseTransporte === "Privado" && tipoTransporte === "Transfer" ? "" : "pr-2"
              }`}
            >
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
            {claseTransporte === "Privado" && tipoTransporte === "Transfer" && (
              <div className="flex flex-col space-y-2 w-full sm:w-1/2 justify-between">
                <Label htmlFor="days">
                  <span className="flex items-center gap-1">Personas:</span>
                </Label>
                <Input
                  id="days"
                  placeholder="Cantidad"
                  className="w-full p-2 border rounded"
                  onChange={(e) => setPersonas(e.target.value)}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <div className="flex flex-col space-y-2 w-full sm:w-1/2">
              <Label htmlFor="start-date">
                <span className="flex items-center gap-1">
                  <CalendarDaysIcon /> Fecha de ida:
                </span>
              </Label>
              <DatePicker
                selected={startDate}
                minDate={minDate}
                maxDate={maxDate}
                dateFormat="dd/MM/yyyy"
                onChange={(date) => setStartDate(date)}
                className="w-full p-2 border rounded"
                placeholderText="Seleccionar fecha"
              />
            </div>
            <div className="flex flex-col space-y-2 w-full sm:w-1/2">
              <Label htmlFor="end-date">
                <span className="flex items-center gap-1">
                  <CalendarDaysIcon /> Fecha de vuelta:
                </span>
              </Label>
              <DatePicker
                selected={endDate}
                minDate={minDate}
                maxDate={maxDate}
                dateFormat="dd/MM/yyyy"
                onChange={(date) => setEndDate(date)}
                className="w-full p-2 border rounded"
                placeholderText="Seleccionar fecha"
              />
            </div>
          </div>
          <div className="flex w-fit">
            <Button
              type="submit"
              className="w-full bg-blue-500 text-white hover:bg-blue-600"
              onClick={scrollToSection}
              disabled={disable}
            >
              Buscar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
