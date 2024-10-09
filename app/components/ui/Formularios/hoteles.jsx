"use client";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Label } from "../label";
import { Button } from "../button";
import { CalendarDaysIcon } from "../../svg/svg";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";
import { handleHoteles } from "@/app/lib/utils";

export default function Hoteles({ category, paquetes, setHoteles, cerro, setCerro, setBusqueda }) {
  const [cerrosHoteles, setCerrosHoteles] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [hotelSeleccionado, setHotelSeleccionado] = useState("");
  const [producto, setProducto] = useState(null);
  const [habitaciones, setHabitaciones] = useState("1");
  const [detalleHabitaciones, setDetalleHabitaciones] = useState([{ mayores: "0", menores: "0" }]);

  const handleHabitacionesChange = (value) => {
    setHabitaciones(value);

    // Inicializa o ajusta el array de detalles de habitaciones
    const nuevosDetalles = Array.from(
      { length: value },
      (_, i) => detalleHabitaciones[i] || { mayores: 0, menores: 0 }
    );
    setDetalleHabitaciones(nuevosDetalles);
  };

  const handleDetalleChange = (index, type, value) => {
    const nuevosDetalles = [...detalleHabitaciones];
    nuevosDetalles[index][type] = value;
    setDetalleHabitaciones(nuevosDetalles);
  };

  useEffect(() => {
    if (paquetes) {
      const hotelesPorCerro = {};

      paquetes.forEach((paquete) => {
        const { cerro, hotel } = paquete;

        if (!hotelesPorCerro[cerro]) {
          hotelesPorCerro[cerro] = new Set();
        }

        hotelesPorCerro[cerro].add(hotel);
      });

      const resultado = {};

      Object.keys(hotelesPorCerro).forEach((cerro) => {
        resultado[cerro] = Array.from(hotelesPorCerro[cerro]);
      });

      setCerrosHoteles(resultado);
    }
  }, [paquetes]);

  const isSaturday = (date) => {
    // 6 representa sábado en JavaScript (0 = domingo, 1 = lunes, ..., 6 = sábado)
    return date.getDay() === 6;
  };

  const isMonday = (date) => {
    // 6 representa sábado en JavaScript (0 = domingo, 1 = lunes, ..., 6 = sábado)
    return date.getDay() === 1;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleHoteles(
      startDate,
      endDate,
      hotelSeleccionado,
      producto,
      cerro,
      paquetes,
      setHoteles,
      detalleHabitaciones
    );
    const busqueda = {
      detalleHabitaciones,
      startDate,
      endDate,
      producto,
    }
    setBusqueda(busqueda);
  };

  const handleCerro = (value) => {
    if (value !== "Las Leñas") {
      setProducto(null);
    }
    setCerro(value);
  };

  const handleHotel = (value) => {
    setHotelSeleccionado(value);
  };

  const handleProducto = (value) => {
    setProducto(value);
  };

  if (!cerrosHoteles) return null;
  return (
    <div className="h-fit w-full">
      <h1 className="flex justify-center p-2 text-2xl font-bold">{category}</h1>
      <div className="p-2 sm:p-4 md:p-6 text-sm md:text-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <div className="flex flex-col space-y-2 w-full sm:w-1/2 justify-between">
              <Label htmlFor="centro">Centro:</Label>
              <Select
                id="centro"
                onValueChange={(value) => handleCerro(value === "none" ? null : value)}
                value={cerro}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar Centro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Ninguno</SelectItem>
                  {Object.keys(cerrosHoteles).map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {cerro && (
              <div className="flex flex-col space-y-2 w-full sm:w-1/2 justify-between">
                <Label htmlFor="centro">Hotel:</Label>
                <Select
                  id="hotel"
                  onValueChange={(value) => handleHotel(value === "none" ? null : value)}
                  value={hotelSeleccionado}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar Hotel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Ninguno</SelectItem>

                    {cerrosHoteles[cerro].map((hotel) => (
                      <SelectItem key={hotel} value={hotel}>
                        {hotel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {cerro === "Las Leñas" ? (
              <div className="flex flex-col space-y-2 w-full sm:w-1/2 justify-between">
                <Label htmlFor="centro">Paquete:</Label>
                <Select
                  id="paquete"
                  onValueChange={(value) => handleProducto(value === "none" ? null : value)}
                  value={producto}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar Hotel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Ninguno</SelectItem>
                    <SelectItem value={"MiniWeek"}>MiniWeek (2 noches)</SelectItem>
                    <SelectItem value={"ExtraWeek"}>ExtraWeek (5 noches)</SelectItem>
                    <SelectItem value={"SkiWeek"}>SkiWeek (7 noches)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : null}
          </div>
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-2 w-full">
            <div className="flex flex-col space-y-2 w-1/2 md:w-1/6 justify-start pt-4 md:pt-6">
              <Label htmlFor="centro">Habitaciones:</Label>
              <Select
                id="habitaciones"
                onValueChange={(value) => handleHabitacionesChange(value)}
                value={habitaciones}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["1", "2", "3", "4", "5"].map((num) => (
                    <SelectItem key={num} value={num}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap w-full">
              {detalleHabitaciones.map((detalle, index) => (
                <div
                  key={index}
                  className="flex flex-row align-center gap-2 w-full md:w-1/2 justify-start pt-2 md:pt-4"
                >
                  <div className="flex flex-col space-y-2 w-full md:w-2/5 justify-between">
                    <Label htmlFor="centro">Mayores Hab {index + 1}:</Label>
                    <Select
                      id={`mayores-${index}`}
                      value={detalle.mayores}
                      onValueChange={(value) => handleDetalleChange(index, "mayores", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["0", "1", "2", "3", "4", "5", "6", "7", "8"].map((num) => (
                          <SelectItem key={num} value={num}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col space-y-2 w-full md:w-2/5 justify-between">
                    <Label htmlFor="centro">Menores Hab {index + 1}:</Label>
                    <Select
                      id={`menores-${index}`}
                      value={detalle.menores}
                      onValueChange={(value) => handleDetalleChange(index, "menores", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["0", "1", "2", "3", "4", "5", "6", "7", "8"].map((num) => (
                          <SelectItem key={num} value={num}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 pt-4">
            <div className="flex flex-col space-y-2 w-full sm:w-1/2">
              <Label htmlFor="start-date">
                <span className="flex items-center gap-1">
                  <CalendarDaysIcon /> Fecha de Inicio:
                </span>
              </Label>
              {cerro === "Las Leñas" ? (
                <DatePicker
                  selected={startDate}
                  dateFormat="dd/MM/yyyy"
                  onChange={(date) => setStartDate(date)}
                  disabled={!producto}
                  className="w-full p-2 border rounded"
                  placeholderText="Seleccionar fecha"
                  filterDate={producto === "Extraweek" ? isMonday : isSaturday}
                />
              ) : (
                <DatePicker
                  selected={startDate}
                  dateFormat="dd/MM/yyyy"
                  onChange={(date) => setStartDate(date)}
                  className="w-full p-2 border rounded"
                  placeholderText="Seleccionar fecha"
                />
              )}
            </div>
            <div className="flex flex-col space-y-2 w-full sm:w-1/2">
              <Label htmlFor="end-date">
                <span className="flex items-center gap-1">
                  <CalendarDaysIcon /> Fecha de Finalización:
                </span>
              </Label>
              <DatePicker
                selected={endDate}
                dateFormat="dd/MM/yyyy"
                onChange={(date) => setEndDate(date)}
                className="w-full p-2 border rounded"
                disabled={producto}
                placeholderText="Seleccionar fecha"
              />
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
}
