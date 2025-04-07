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
  const { paquetes, reglas } = useAlojamientos(null);
  const { rentals, pases, clases, traslados } = useGroupedSpreadsheets(paquetes ? null : "delay");
  const [startDate, setStartDate] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [cerro, setCerro] = useState("");
  const [resHoteles, setHoteles] = useState(null);
  const [resPases, setPases] = useState(null);
  const [resClases, setClases] = useState(null);
  const [resTraslados, setTraslados] = useState(null);
  const [resEquipos, setEquipos] = useState(null);
  const [paquetesSeleccionados, setPaquetesSeleccionados] = useState([]);
  const [originales, setOriginales] = useState([]);
  const [totalCompra, setTotalCompra] = useState(0);
  const [category, setCategory] = useState("Alojamientos");

  useEffect(() => {}, [rentals]);

  const handleCategorySelect = (cat) => {
    setCategory(cat);
  };

  const agregarPaquete = (paquete) => {
    setPaquetesSeleccionados((prev) => [...prev, paquete]);
    setOriginales((prev) => [...prev, paquete]);
    setTotalCompra((prev) => prev + paquete.price);
    //console.log("agregarPaquete");
  };

  const eliminarPaquete = (index) => {
    const paqueteEliminado = paquetesSeleccionados[index];
    setPaquetesSeleccionados((prev) => prev.filter((_, i) => i !== index));
    setOriginales((prev) => prev.filter((_, i) => i !== index));
    setTotalCompra((prev) => prev - paqueteEliminado.price);
    //console.log("eliminarPaquete");
  };

  if (!paquetes) return <Spinner />;

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
                  setHoteles,
                  setEquipos,
                  setPases,
                  setClases,
                  setTraslados,
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
            resHoteles,
            resPases,
            resClases,
            resTraslados,
            resEquipos,
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
