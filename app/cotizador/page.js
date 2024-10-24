"use client";
import { useState } from "react";
import Navbar from "@/app/components/ui/navbar";
import Presupuesto from "../components/ui/presupuesto";
import { generatePDF, handleBusqueda, handleFormularios, handleHoteles } from "../lib/utils";
import useSpeadsheets from "../lib/hooks/spreadsheet";
import { Button } from "../components/ui/button";

export default function Cotizador() {
  const { paquetes, rentals, clases, pases, traslado } = useSpeadsheets(null);
  const [cerro, setCerro] = useState("");
  const [resHoteles, setHoteles] = useState(null);
  const [resPases, setPases] = useState(null);
  const [resClases, setClases] = useState(null);
  const [resTraslado, setTraslado] = useState(null);
  const [resEquipos, setEquipos] = useState(null);
  const [paquetesSeleccionados, setPaquetesSeleccionados] = useState([]);

  const [totalCompra, setTotalCompra] = useState(0);
  const [category, setCategory] = useState("Hoteles");

  const handleCategorySelect = (cat) => {
    setCategory(cat);
  };

  const agregarPaquete = (paquete) => {
    setPaquetesSeleccionados((prev) => [...prev, paquete]);
    setTotalCompra((prev) => prev + paquete.price);
  };

  const eliminarPaquete = (index) => {
    const paqueteEliminado = paquetesSeleccionados[index];
    setPaquetesSeleccionados((prev) => prev.filter((_, i) => i !== index));
    setTotalCompra((prev) => prev - paqueteEliminado.price);
  };

  if (!paquetes) return null;
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="w-full p-4 sm:p-6 md:p-8">
        <div className="grid gap-8">
          <div className="bg-card rounded-lg shadow-lg h-fit w-full">
            <div className="p-4 sm:p-6 md:p-8 border-b">
              <h1 className="text-2xl font-bold mb-2">Propuesta de Viaje</h1>
              <p className="text-muted-foreground">Crea tu presupuesto de viaje</p>
            </div>
            <div className="flex justify-center px-4 pt-4 sm:px-6 md:px-8">
              <div className="space-y-2">
                {["Alojamiento", "Equipos", "Transporte", "Clases", "Pases"].map((cat) => (
                  <Button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`mx-2 ${category === cat ? "bg-blue-500" : "bg-black"}`}
                  >
                    {cat}
                  </Button>
                ))}
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
                  traslado,
                  setHoteles,
                  setEquipos,
                  setPases,
                  setClases,
                  setTraslado,
                  cerro,
                  setCerro
                )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {handleBusqueda(
            category,
            resHoteles,
            resPases,
            resClases,
            resTraslado,
            resEquipos,
            agregarPaquete
          )}
        </div>
        <div className="grid gap-8">
          {paquetesSeleccionados.length > 0 && (
            <Presupuesto
              paquetesSeleccionados={paquetesSeleccionados}
              totalCompra={totalCompra}
              generatePDF={() => generatePDF(paquetesSeleccionados, totalCompra)}
              eliminarPaquete={eliminarPaquete}
            />
          )}
        </div>
      </div>
    </div>
  
  );
}
