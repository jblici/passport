"use client";
import Navbar from "@/app/components/ui/navbar";
import Presupuesto from "./components/presupuesto";
import { Button } from "./components/ui/button";
import Passport from "/public/Passport.png";
import Image from "next/image";
import Spinner from "./components/ui/Spinner";
import useAlojamientos from "./lib/hooks/paquetes";
import useGroupedSpreadsheets from "./lib/hooks/spreadsheet";
import SearchFilters from "./components/SearchFilters";
import SearchResults from "./components/SearchResults";
import { CotizadorProvider } from "./context/CotizadorProvider";
import { useCotizador } from "./context/CotizadorContext";

function PresupuestoCondicional() {
  const { cartState } = useCotizador();
  if (cartState.paquetesSeleccionados.length === 0) return null;
  return <Presupuesto />;
}

function CotizadorContent() {
  const {
    paquetes,
    reglas,
    error: alojamientosError,
    loading: alojamientosLoading,
  } = useAlojamientos();
  const {
    rentals,
    pases,
    clases,
    traslados,
    error: spreadsheetError,
    loading: spreadsheetLoading,
  } = useGroupedSpreadsheets();

  // Combined loading and error states
  const isLoading = alojamientosLoading || spreadsheetLoading;
  const hasError = alojamientosError || spreadsheetError;
  const errorMessage = alojamientosError || spreadsheetError;

  if (isLoading) return <Spinner />;

  if (hasError) {
    return (
      <div className="flex flex-col">
        <Navbar />
        <div className="w-full p-4 sm:p-6 md:p-8">
          <div className="bg-card rounded-lg shadow-lg p-8 border-l-4 border-red-500">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Error loading data</h2>
            <p className="text-muted-foreground mb-4">{errorMessage}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
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
            <SearchFilters
              paquetes={paquetes}
              rentals={rentals}
              clases={clases}
              pases={pases}
              traslados={traslados}
            />
          </div>
        </div>
        <SearchResults reglas={reglas} />
        <div className="grid gap-8">
          <PresupuestoCondicional />
        </div>
      </div>
    </div>
  );
}

export default function Cotizador() {
  return (
    <CotizadorProvider>
      <CotizadorContent />
    </CotizadorProvider>
  );
}
