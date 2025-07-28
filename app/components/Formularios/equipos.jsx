"use client";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { CalendarDaysIcon } from "../svg/svg";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { GoAlert } from "react-icons/go";
import { handleEquipos } from "@/app/lib/utils/secciones";
import { scrollToSection } from "@/app/lib/utils/extras";
import { cerros } from "../ui/cerros";

const cerrosInfo = {
  Castor: {
    mensaje: (
      <>
        <span>Junior: 0 a 11 años.</span>
        <span>Adulto: 12 a 69 años.</span>
      </>
    ),
  },
  Catedral: {
    mensaje: (
      <>
        <span>Los equipos deportivos son ideales para principiantes e intermedios.</span>
        <span>
          Los equipos Junior son para niños de nivel principiante e intermedio hasta 11 años.
        </span>
        <span>Los equipos de alto nivel son ideales para intermedios y avanzados.</span>
        <span>En ningún caso incluyen seguro de rotura, robo o extravío.</span>
      </>
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
  const [cerrosGamas, setCerrosGamas] = useState({});

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

  useEffect(() => {
    if (equipos) {
      const gamasPorCerro = {};

      equipos.forEach((equipo) => {
        const { cerro, gama } = equipo;

        if (!gamasPorCerro[cerro]) {
          gamasPorCerro[cerro] = new Set();
        }

        gamasPorCerro[cerro].add(gama);
      });

      const resultado = {};
      Object.keys(gamasPorCerro).forEach((cerro) => {
        resultado[cerro] = Array.from(gamasPorCerro[cerro]);
      });

      setCerrosGamas(resultado);
    }
  }, [equipos]);

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
                {cerros}
              </Select>
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
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <div
              className={`flex flex-col space-y-2 w-full sm:w-1/2 justify-between ${
                !cerrosInfo[cerro] && "pr-2"
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
                dateFormat="dd/MM/yyyy"
                onChange={(date) => setStartDate(date)}
                className="w-full p-2 border rounded"
                withPortal
                placeholderText="Seleccionar fecha"
              />
            </div>
            {cerrosGamas[cerro] && (
              <div className="flex flex-col space-y-2 w-full sm:w-1/2 justify-between">
                <Label htmlFor="gama">Gama:</Label>
                <Select id="gama" onValueChange={handleGama}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar Gama" />
                  </SelectTrigger>
                  <SelectContent>
                    {cerrosGamas[cerro]?.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
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
