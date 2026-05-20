"use client";
import Navbar from "@/app/components/ui/navbar";
import Presupuesto from "./components/presupuesto";
import { Button } from "./components/ui/button";
import Spinner from "./components/ui/Spinner";
import useAlojamientos from "./lib/hooks/paquetes";
import useGroupedSpreadsheets from "./lib/hooks/spreadsheet";
import SearchResults from "./components/SearchResults";
import { CotizadorProvider } from "./context/CotizadorProvider";
import { useCotizador } from "./context/CotizadorContext";
import { handleFormularios } from "./lib/utils/secciones.jsx";

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

  const {
    searchState,
    setCerro,
    setBusqueda,
    setStartDate,
    setHotelSearchResults,
    setEquipmentSearchResults,
    setPassSearchResults,
    setClassSearchResults,
    setTransferSearchResults,
  } = useCotizador();

  const { category, cerro, startDate } = searchState;

  const isLoading = alojamientosLoading || spreadsheetLoading;
  const errorMessage = alojamientosError || spreadsheetError;

  if (isLoading) return <Spinner />;

  if (errorMessage) {
    return (
      <div className="flex flex-col">
        <div className="w-full p-2 sm:p-4">
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
      <div className="w-full p-2 sm:p-4">
        <div className="grid gap-8">
          <div className="bg-card rounded-lg shadow-lg h-fit w-full">
            {category && paquetes && rentals && clases && pases && traslados
              ? handleFormularios(
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
                  setStartDate,
                )
              : category && <p className="text-muted-foreground">Loading filters...</p>}
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
