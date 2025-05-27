"use client";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { CalendarDaysIcon } from "../svg/svg";
import {
  Select,
  SelectGroup,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import MultiSelect from "react-select";
import { GoAlert } from "react-icons/go";
import Spinner from "../ui/Spinner";
import { handleHoteles } from "@/app/lib/utils/hoteles";
import { scrollToSection } from "@/app/lib/utils/extras";
import { cerros } from "../ui/cerros";

const cerrosInfo = {
  "Las Leñas": {
    mensaje: (
      <>
        <span>Menores 0 a 2 años: GRATIS en cuna.</span>
        <span>Menores: 6 a 11 años</span>
        <span>Mayores: + 12 años</span>
      </>
    ),
  },
  Catedral: {
    mensaje: (
      <>
        <span>Junior: hasta 11 años.</span>
        <span>Adulto: 12 a 69 años.</span>
      </>
    ),
  },
  Cavihue: {
    mensaje: (
      <>
        <span>Menores: 0 a 2 años: GRATIS en cuna</span>
        <span>Mayores: + 3 años</span>
      </>
    ),
  },
};

export default function Hoteles({
  category,
  paquetes,
  setHoteles,
  cerro,
  setCerro,
  setBusqueda,
  startDate,
  setStartDate,
}) {
  const [cerrosHoteles, setCerrosHoteles] = useState({});
  const [endDate, setEndDate] = useState(null);
  const [selectedHoteles, setSelectedHoteles] = useState([]);
  const [producto, setProducto] = useState(null);
  const [habitaciones, setHabitaciones] = useState("1");
  const [detalleHabitaciones, setDetalleHabitaciones] = useState([{ mayores: "0", menores: "0" }]);
  const currentYear = new Date().getFullYear();

  // Define los límites de fecha
  const minDate = new Date(currentYear, 5, 1); // Junio (mes 5 porque es basado en 0)
  const maxDate = new Date(currentYear, 9, 31); // Octubre

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
    return date.getDay() === 6;
  };

  const isMonday = (date) => {
    return date.getDay() === 1;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const hoteles = selectedHoteles.map((hotel) => hotel.value);
    handleHoteles(
      startDate,
      endDate,
      hoteles,
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
    };
    setBusqueda(busqueda);
  };

  const handleCerro = (value) => {
    setCerro(value);
    setSelectedHoteles([]); // Limpiar hoteles al cambiar de cerro
    if (value !== "Las Leñas") {
      setProducto(null);
    } else if (value === "Las Leñas") {
      setEndDate(null);
    }
  };

  const handleProducto = (value) => {
    setProducto(value);
  };

  if (!cerrosHoteles) return <Spinner />;
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
                onValueChange={(value) => handleCerro(value === "todos" ? null : value)}
                value={cerro}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar centro" />
                </SelectTrigger>
                {cerros}
              </Select>
            </div>
            {cerro && cerrosHoteles[cerro] && cerrosHoteles[cerro].length > 0 && (
              <div className="flex flex-col space-y-2 w-full sm:w-1/2 justify-between">
                <Label htmlFor="centro">Alojamiento:</Label>
                <MultiSelect
                  defaultValue={null}
                  onChange={setSelectedHoteles}
                  options={cerrosHoteles[cerro].map((hotel) => ({
                    value: hotel,
                    label: hotel,
                  }))}
                  isMulti={true}
                  placeholder="Seleccionar alojamientos"
                />
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
                    <SelectItem value={"MaxiWeek"}>MaxiWeek (5 noches)</SelectItem>
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
                  minDate={minDate}
                  maxDate={maxDate}
                  dateFormat="dd/MM/yyyy"
                  onChange={(date) => setStartDate(date)}
                  className="w-full p-2 border rounded"
                  withPortal
                  disabled={!producto}
                  placeholderText="Seleccionar fecha"
                  filterDate={producto === "MaxiWeek" ? isMonday : isSaturday}
                />
              ) : (
                <DatePicker
                  selected={startDate}
                  value={startDate}
                  minDate={minDate}
                  maxDate={maxDate}
                  className="w-full p-2 border rounded"
                  withPortal
                  dateFormat="dd/MM/yyyy"
                  onChange={(date) => setStartDate(date)}
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
                minDate={minDate}
                maxDate={maxDate}
                className="w-full p-2 border rounded"
                withPortal
                dateFormat="dd/MM/yyyy"
                onChange={(date) => setEndDate(date)}
                disabled={producto}
                placeholderText="Seleccionar fecha"
              />
            </div>
          </div>
          <div className="flex justify-between w-full">
            <div className="flex w-fit relative">
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
