"use client";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Label } from "../label";
import { Button } from "../button";
import { CalendarDaysIcon } from "../../svg/svg";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";
import { handleClases } from "@/app/lib/utils";
import { Input } from "../input";

export default function Clases({
  category,
  clases,
  setClases,
  cerro,
  setCerro,
  startDate,
  setStartDate,
}) {
  const [disabled, setDisabled] = useState(true);
  const [dias, setDias] = useState(null);
  const [tipo, setTipo] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleClases(cerro, clases, setClases, startDate, Number(dias), tipo);
  };

  const handleTipo = (value) => {
    setTipo(value);
  };

  const handleCerro = (value) => {
    setCerro(value);
  };

  return (
    <div className="h-fit w-full">
      <h1 className="flex justify-center p-2 text-2xl font-bold">{category}</h1>
      <div className="p-4 sm:p-6 md:p-8">
        <form className="space-y-4">
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
            {/*
            <div className="flex flex-col space-y-2 w-full sm:w-1/2 justify-between">
              <Label htmlFor="centro">Tipo:</Label>
              <Select id="clase" onValueChange={handleTipo} value={tipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar Equipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRINCIPIANTES">Principiantes</SelectItem>
                  <SelectItem value="UNIVERSITARIOS">Universitarios</SelectItem>
                  <SelectItem value="NORMAL">Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            */}
          </div>
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <div className="flex flex-col space-y-2 w-full sm:w-1/2">
              <Label htmlFor="start-date">
                <span className="flex items-center gap-1">
                  <CalendarDaysIcon /> Fecha de Inicio:
                </span>
              </Label>
              <DatePicker
                selected={startDate}
                dateFormat="dd/MM/yyyy"
                onChange={(date) => setStartDate(date)}
                className="w-full p-2 border rounded"
                placeholderText="Seleccionar fecha"
              />
            </div>
            <div className="flex flex-col space-y-2 w-full sm:w-1/2 justify-between">
              <Label htmlFor="days">
                <span className="flex items-center gap-1">Dias:</span>
              </Label>
              <Input
                id="days"
                placeholder="Dias"
                className="w-full p-2 border rounded"
                onChange={(e) => setDias(e.target.value)}
              />
            </div>
          </div>
          <div className="flex w-fit">
            <Button
              type="submit"
              onClick={handleSubmit}
              className="w-full bg-blue-500 text-white hover:bg-blue-600"
            >
              Buscar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
