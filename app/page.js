"use client";
import { useEffect, useState } from "react";
import Navbar from "@/app/components/ui/navbar";
import Presupuesto from "./components/presupuesto";
import { handleBusqueda, handleFormularios } from "./lib/utils/secciones";
import { Button } from "./components/ui/button";
import Passport from "/public/Passport.png";
import Image from "next/image";
import Spinner from "./components/ui/Spinner";
import useAlojamientos from "./lib/hooks/paquetes";
import useGroupedSpreadsheets from "./lib/hooks/spreadsheet";

export default function Cotizador() {
  const { paquetes, reglas, error: alojamientosError, loading: alojamientosLoading } = useAlojamientos();
  const { rentals, pases, clases, traslados, error: spreadsheetError, loading: spreadsheetLoading } = useGroupedSpreadsheets();
  const [startDate, setStartDate] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [cerro, setCerro] = useState("");
  const [hotelSearchResults, setHotelSearchResults] = useState(null);
  const [passSearchResults, setPassSearchResults] = useState(null);
  const [classSearchResults, setClassSearchResults] = useState(null);
  const [transferSearchResults, setTransferSearchResults] = useState(null);
  const [equipmentSearchResults, setEquipmentSearchResults] = useState(null);
  const [paquetesSeleccionados, setPaquetesSeleccionados] = useState([]);
  const [originales, setOriginales] = useState([]);
  const [totalCompra, setTotalCompra] = useState(0);
  const [category, setCategory] = useState("Alojamientos");

  // Combined loading and error states
  const isLoading = alojamientosLoading || spreadsheetLoading;
  const hasError = alojamientosError || spreadsheetError;
  const errorMessage = alojamientosError || spreadsheetError;

  const handleCategorySelect = (cat) => {
    setCategory(cat);
  };

  const agregarPaquete = (paquete) => {
    setPaquetesSeleccionados((prev) => [...prev, paquete]);
    setOriginales((prev) => [...prev, paquete]);
    setTotalCompra((prev) => prev + paquete.price);
  };

  const eliminarPaquete = (index) => {
    const paqueteEliminado = paquetesSeleccionados[index];
    setPaquetesSeleccionados((prev) => prev.filter((_, i) => i !== index));
    setOriginales((prev) => prev.filter((_, i) => i !== index));
    setTotalCompra((prev) => prev - paqueteEliminado.price);
  };

  if (isLoading) return <Spinner />;

  if (hasError) {
    return (
      <div className="flex flex-col">
        <Navbar />
        <div className="w-full p-4 sm:p-6 md:p-8">
          <div className="bg-card rounded-lg shadow-lg p-8 border-l-4 border-red-500">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Error loading data</h2>
            <p className="text-muted-foreground mb-4">{errorMessage}</p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="w-full p-4 sm:p-6 md:p-8">
        <div className="grid gap-8">
          <div className="bg-card rounded-lg shadow-lg h-fit w-full">
            <div className="flex justify-between border-b w-full">
              <div className="p-4 sm:p-6 md:p-8">
                <h1 className="text-2xl font-bold mb-2">Propuesta de Viaje</h1>
                <p className="text-muted-foreground">Crea tu presupuesto de viaje</p>
              </div>
              <Image src={Passport} alt="Passport" className="w-22 h-22" />
            </div>
            <div className="flex justify-center px-4 pt-4 sm:px-6 md:px-8">
              <div className="space-y-2">
                {["Alojamientos", "Medios de Elevación", "Equipos", "Clases", "Transporte"].map(
                  (cat) => (
                    <Button
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      className={`mx-2 ${category === cat ? "bg-blue-500" : "bg-black"}`}
                    >
                      {cat}
                    </Button>
                  )
                )}
              </div>
            </div>
            <div className="p-4 sm:p-6 md:p-8">
              {category &&
                handleFormularios(
                  category,
                  paquetes,
                  rentals,
                  clases,
                  pases,
                  traslados,
                  setHotelSearchResults,
                  setEquipmentSearchResults,
                  setPassSearchResults,
                  setClassSearchResults,
                  setTransferSearchResults,
                  cerro,
                  setCerro,
                  setBusqueda,
                  startDate,
                  setStartDate
                )}
            </div>
          </div>
        </div>
        <div id="busqueda" className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {handleBusqueda(
            category,
            hotelSearchResults,
            passSearchResults,
            classSearchResults,
            transferSearchResults,
            equipmentSearchResults,
            agregarPaquete,
            reglas
          )}
        </div>
        <div className="grid gap-8">
          {paquetesSeleccionados.length > 0 && (
            <Presupuesto
              paquetesSeleccionados={paquetesSeleccionados}
              setPaquetesSeleccionados={setPaquetesSeleccionados}
              busqueda={busqueda}
              totalCompra={totalCompra}
              setTotalCompra={setTotalCompra}
              agregarPaquete={agregarPaquete}
              eliminarPaquete={eliminarPaquete}
              originales={originales}
              cerro={cerro}
            />
          )}
        </div>
      </div>
    </div>
  );
}
