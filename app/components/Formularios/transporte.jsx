"use client";
import { useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import FormCard from "../ui/FormCard";
import RequiredBadge from "../ui/RequiredBadge";
import ToggleYesNo from "../ui/ToggleYesNo";
import { handleTransporte } from "@/app/lib/utils/secciones";
import { scrollToSection } from "@/app/lib/utils/extras";
import { cerros } from "../ui/cerros";
import DateField from "../ui/DateField";
import { Search } from "lucide-react";

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

  const minDate = new Date(currentYear, 5, 1);
  const maxDate = new Date(currentYear, 9, 31);

  useEffect(() => {
    if (cerro && startDate && endDate) {
      setDisable(false);
    }
  }, [cerro, endDate, startDate, traslado]);

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
      personas,
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
      <h1 className="text-center text-3xl font-bold mb-2">{category}</h1>
      <p className="text-center text-gray-600 mb-8">Configura el transporte para tu viaje</p>
      <div className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Transporte Section */}
          <FormCard icon="🚌" title="Tipo de Transporte" subtitle="Elige el tipo de traslado que prefieres">
            <div className="space-y-4">
              <div>
                <Label className="font-semibold mb-3 block">Transporte</Label>
                <ToggleYesNo
                  onValueChange={handleTipoTransporte}
                  options={[{ label: "Pasaje" }, { label: "Transfer" }]}
                />
              </div>

              {tipoTransporte === "Transfer" && (
                <div className="border-t pt-4">
                  <Label className="font-semibold mb-3 block">Clase de Transfer</Label>
                  <ToggleYesNo
                    onValueChange={handleClaseTransporte}
                    options={[{ label: "Regular" }, { label: "Privado" }]}
                  />
                </div>
              )}
            </div>
          </FormCard>

          {/* Row 2: Detalles y Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormCard icon="📍" title="Detalles" subtitle="Centro y personas">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="centro" className="font-semibold">
                    Centro <RequiredBadge />
                  </Label>
                  <Select id="centro" onValueChange={handleCerro} value={cerro}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar Centro" />
                    </SelectTrigger>
                    {cerros}
                  </Select>
                </div>

                {claseTransporte === "Privado" && tipoTransporte === "Transfer" && (
                  <div className="space-y-2">
                    <Label htmlFor="personas" className="font-semibold">
                      Cantidad de Personas <RequiredBadge />
                    </Label>
                    <Input
                      id="personas"
                      type="number"
                      placeholder="Ingrese cantidad"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onChange={(e) => setPersonas(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </FormCard>

            {/* Fechas */}
            <FormCard icon="📅" title="Fechas del Viaje" subtitle="Selecciona ida y vuelta">
              <div className="space-y-4">
                <DateField
                  id="start-date"
                  label="Fecha de Ida"
                  value={startDate}
                  onChange={setStartDate}
                  minDate={minDate}
                  maxDate={maxDate}
                  required
                />
                <DateField
                  id="end-date"
                  label="Fecha de Vuelta"
                  value={endDate}
                  onChange={setEndDate}
                  minDate={minDate}
                  maxDate={maxDate}
                  required
                />
              </div>
            </FormCard>
          </div>

          {/* Botón */}
          <Button
            type="submit"
            size="lg"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 py-6 font-bold text-lg shadow-lg flex items-center justify-center gap-2"
            onClick={scrollToSection}
            disabled={disable}
          >
            <Search size={20} />
            Buscar Traslados
          </Button>
        </form>
      </div>
    </div>
  );
}
