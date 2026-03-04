"use client";
import React, { useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import MultiSelect from "react-select";
import Spinner from "../ui/Spinner";
import DateField from "../ui/DateField";
import InfoAlert from "../ui/InfoAlert";
import FormCard from "../ui/FormCard";
import RequiredBadge from "../ui/RequiredBadge";
import { handleHoteles } from "@/app/lib/utils/hoteles";
import { scrollToSection } from "@/app/lib/utils/extras";
import { cerros } from "../ui/cerros";
import { cerrosInfoHoteles } from "@/app/lib/config/cerrosInfo";
import { Search } from "lucide-react";

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

  const minDate = new Date(2025, 5, 1);
  const maxDate = new Date(currentYear, 9, 31);

  const handleHabitacionesChange = (value) => {
    setHabitaciones(value);
    const nuevosDetalles = Array.from(
      { length: value },
      (_, i) => detalleHabitaciones[i] || { mayores: "0", menores: "0" },
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
        if (!hotelesPorCerro[paquete.cerro]) {
          hotelesPorCerro[paquete.cerro] = new Set();
        }
        hotelesPorCerro[paquete.cerro].add(paquete.hotel);
      });

      const resultado = {};
      Object.keys(hotelesPorCerro).forEach((cerro) => {
        resultado[cerro] = Array.from(hotelesPorCerro[cerro]);
      });
      setCerrosHoteles(resultado);
    }
  }, [paquetes]);

  const isSaturday = (date) => date.getDay() === 6;
  const isMonday = (date) => date.getDay() === 1;

  const handleSubmit = (e) => {
    e.preventDefault();
    const hoteles = selectedHoteles.map((h) => h.value);
    handleHoteles(
      startDate,
      endDate,
      hoteles,
      producto,
      cerro,
      paquetes,
      setHoteles,
      detalleHabitaciones,
    );
    setBusqueda({ detalleHabitaciones, startDate, endDate, producto });
  };

  const handleCerro = (value) => {
    setCerro(value);
    setSelectedHoteles([]);
    if (value !== "Las Leñas") setProducto(null);
    if (value === "Las Leñas") setEndDate(null);
  };

  if (!cerrosHoteles) return <Spinner />;

  return (
    <div className="h-fit w-full">
      <h1 className="text-center text-3xl font-bold mb-2">{category}</h1>
      <p className="text-center text-gray-600 mb-8">Completa los detalles para buscar alojamientos</p>
      <div className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Destino y Alojamiento + Paquete */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormCard icon="🏔️" title="Destino y Alojamiento" subtitle="Selecciona el centro de esquí y hoteles">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="centro" className="font-semibold">
                    Centro <RequiredBadge />
                  </Label>
                  <Select value={cerro} onValueChange={handleCerro}>
                    <SelectTrigger id="centro">
                      <SelectValue placeholder="Seleccionar centro" />
                    </SelectTrigger>
                    {cerros}
                  </Select>
                </div>
                {cerro && cerrosHoteles[cerro]?.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="hoteles" className="font-semibold">
                      Alojamiento(s) <RequiredBadge />
                    </Label>
                    <MultiSelect
                      inputId="hoteles"
                      onChange={setSelectedHoteles}
                      options={cerrosHoteles[cerro].map((h) => ({ value: h, label: h }))}
                      isMulti
                      placeholder="Seleccionar..."
                    />
                  </div>
                )}
              </div>
            </FormCard>

            {/* Paquete Las Leñas */}
            {cerro === "Las Leñas" && (
              <FormCard icon="📦" title="Paquete Especial" subtitle="Disponible solo para Las Leñas">
                <div className="space-y-2">
                  <Label htmlFor="paquete" className="font-semibold">
                    Seleccionar Paquete
                  </Label>
                  <Select
                    value={producto}
                    onValueChange={(v) => setProducto(v === "none" ? null : v)}
                  >
                    <SelectTrigger id="paquete">
                      <SelectValue placeholder="Ninguno" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Ninguno</SelectItem>
                      <SelectItem value="MiniWeek">MiniWeek (2 noches)</SelectItem>
                      <SelectItem value="MaxiWeek">MaxiWeek (5 noches)</SelectItem>
                      <SelectItem value="SkiWeek">SkiWeek (7 noches)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </FormCard>
            )}
          </div>

          {/* Habitaciones */}
          <FormCard icon="🏠" title="Configurar Habitaciones" subtitle="Define adultos y menores por habitación">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="habitaciones" className="font-semibold">
                  Cantidad de Habitaciones <RequiredBadge />
                </Label>
                <Select value={habitaciones} onValueChange={handleHabitacionesChange}>
                  <SelectTrigger id="habitaciones">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["1", "2", "3", "4", "5"].map((num) => (
                      <SelectItem key={num} value={num}>
                        {num} {num === "1" ? "habitación" : "habitaciones"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Detalle por habitación */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {detalleHabitaciones.map((detalle, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-blue-50 to-white">
                    <h4 className="font-semibold text-sm mb-4 text-gray-800">Habitación {index + 1}</h4>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`mayores-${index}`} className="text-sm font-medium text-gray-700">
                          👥 Adultos
                        </Label>
                        <Select
                          value={detalle.mayores}
                          onValueChange={(v) => handleDetalleChange(index, "mayores", v)}
                        >
                          <SelectTrigger id={`mayores-${index}`} className="text-sm mt-1">
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
                      <div>
                        <Label htmlFor={`menores-${index}`} className="text-sm font-medium text-gray-700">
                          👶 Menores
                        </Label>
                        <Select
                          value={detalle.menores}
                          onValueChange={(v) => handleDetalleChange(index, "menores", v)}
                        >
                          <SelectTrigger id={`menores-${index}`} className="text-sm mt-1">
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
                  </div>
                ))}
              </div>
            </div>
          </FormCard>

          {/* Fechas */}
          <FormCard icon="📅" title="Fechas del Viaje" subtitle="Selecciona las fechas de inicio y fin">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DateField
                id="start-date"
                label="Fecha de Inicio"
                value={startDate}
                onChange={setStartDate}
                minDate={minDate}
                maxDate={maxDate}
                required
                disabled={cerro === "Las Leñas" && !producto}
                filterDate={cerro === "Las Leñas" && producto === "MaxiWeek" ? isMonday : isSaturday}
              />
              <DateField
                id="end-date"
                label="Fecha de Finalización"
                value={endDate}
                onChange={setEndDate}
                minDate={minDate}
                maxDate={maxDate}
                disabled={!!producto}
              />
            </div>
          </FormCard>

          {/* Botón */}
          <Button
            type="submit"
            size="lg"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 py-6 font-bold text-lg shadow-lg flex items-center justify-center gap-2"
            onClick={scrollToSection}
          >
            <Search size={20} />
            Buscar Alojamientos
          </Button>
        </form>

        {/* Info */}
        {cerrosInfoHoteles[cerro] && (
          <div className="mt-8">
            <InfoAlert title={cerrosInfoHoteles[cerro].titulo}>
              {cerrosInfoHoteles[cerro].detalles.map((detalle, i) => (
                <div key={i}>{detalle}</div>
              ))}
            </InfoAlert>
          </div>
        )}
      </div>
    </div>
  );
}
