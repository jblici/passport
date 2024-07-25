"use client";
import { useState } from "react";
import Navbar from "@/app/components/ui/navbar";
import useFetch from "@/app/lib/useFetch";
import Formulario from "../components/ui/formulario";
import ResumenPresupuesto from "../components/ui/resumenPresupuesto";
import ResumenPaquetes from "../components/ui/resumenPaquete";
import { generatePDF, handleSubmit } from "../lib/utils";

export default function Cotizador() {
  const { paquetes } = useFetch();
  const [resultados, setResultados] = useState();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pax, setPax] = useState("");
  const [skiRental, setSkiRental] = useState(false);
  const [transportation, setTransportation] = useState(false);
  const [skiLessons, setSkiLessons] = useState(false);
  const [skiPasses, setSkiPasses] = useState(false);
  const [paquetesSeleccionados, setPaquetesSeleccionados] = useState([]);
  const [totalCompra, setTotalCompra] = useState(0);

  const agregarPaquete = (paquete) => {
    setPaquetesSeleccionados((prev) => [...prev, paquete]);
    setTotalCompra((prev) => prev + paquete.price);
  };

  const eliminarPaquete = (index) => {
    const paqueteEliminado = paquetesSeleccionados[index];
    setPaquetesSeleccionados((prev) => prev.filter((_, i) => i !== index));
    setTotalCompra((prev) => prev - paqueteEliminado.price);
  };

  return (
    <div className="flex flex-col sm:flex-row">
      <Navbar />
      <div className="w-full p-4 sm:p-6 md:p-8">
        <div className="grid gap-8">
          <Formulario
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            pax={pax}
            setPax={setPax}
            skiRental={skiRental}
            setSkiRental={setSkiRental}
            transportation={transportation}
            setTransportation={setTransportation}
            skiLessons={skiLessons}
            setSkiLessons={setSkiLessons}
            skiPasses={skiPasses}
            setSkiPasses={setSkiPasses}
            onSubmit={handleSubmit(paquetes, startDate, endDate, pax, setResultados)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {resultados && (
            <ResumenPaquetes resultados={resultados} agregarPaquete={agregarPaquete} />
          )}
        </div>
        <div className="grid gap-8">
          {paquetesSeleccionados.length > 0 && (
            <ResumenPresupuesto
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
