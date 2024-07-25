"use client";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Label } from "./label";
import { Input } from "./input";
import { Checkbox } from "./checkbox";
import { Button } from "./button";
import { CalendarDaysIcon, Pipol } from "../svg/svg";

const Formulario = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  pax,
  setPax,
  skiRental,
  setSkiRental,
  transportation,
  setTransportation,
  skiLessons,
  setSkiLessons,
  skiPasses,
  setSkiPasses,
  onSubmit,
}) => (
  <div className="bg-card rounded-lg shadow-lg h-fit w-full">
    <div className="p-4 sm:p-6 md:p-8 border-b">
      <h1 className="text-2xl font-bold mb-2">Propuesta de Viaje</h1>
      <p className="text-muted-foreground">Crea tu presupuesto de viaje</p>
    </div>
    <div className="p-4 sm:p-6 md:p-8">
      <form onSubmit={onSubmit} className="">
        <div className="flex flex-wrap items-center gap-4 pb-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="start-date">
              <span className="flex items-center gap-1">
                <CalendarDaysIcon /> Fecha de Inicio
              </span>
            </Label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="w-full p-2 border rounded"
              placeholderText="Seleccionar fecha"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="end-date">
              <span className="flex items-center gap-1">
                <CalendarDaysIcon /> Fecha de Finalización
              </span>
            </Label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="w-full p-2 border rounded"
              placeholderText="Seleccionar fecha"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="pax">
              <span className="flex items-center gap-1">
                <Pipol />
                Cantidad de personas
              </span>
            </Label>
            <Input id="pax" type="number" value={pax} onChange={(e) => setPax(e.target.value)} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 pb-4">
          <div className="flex flex-col space-y-2">
            <Label>Alquiler de Ski</Label>
            <div className="flex items-center gap-2">
              <Checkbox
                id="ski-rental"
                checked={skiRental}
                onChange={(e) => setSkiRental(e.target.checked)}
              />
              <Label htmlFor="ski-rental">Incluir</Label>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <Label>Transporte</Label>
            <div className="flex items-center gap-2">
              <Checkbox
                id="transportation"
                checked={transportation}
                onChange={(e) => setTransportation(e.target.checked)}
              />
              <Label htmlFor="transportation">Incluir</Label>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <Label>Clases de Ski</Label>
            <div className="flex items-center gap-2">
              <Checkbox
                id="ski-lessons"
                checked={skiLessons}
                onChange={(e) => setSkiLessons(e.target.checked)}
              />
              <Label htmlFor="ski-lessons">Incluir</Label>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <Label>Pases de Ski</Label>
            <div className="flex items-center gap-2">
              <Checkbox
                id="ski-passes"
                checked={skiPasses}
                onChange={(e) => setSkiPasses(e.target.checked)}
              />
              <Label htmlFor="ski-passes">Incluir</Label>
            </div>
          </div>
        </div>
        <div className="flex w-fit">
          <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600">
            Buscar
          </Button>
        </div>
      </form>
    </div>
  </div>
);

export default Formulario;
