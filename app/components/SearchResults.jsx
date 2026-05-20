import { handleBusqueda } from "@/app/lib/utils/secciones.jsx";
import { useCotizador } from "@/app/context/CotizadorContext";

const SearchResults = ({ reglas }) => {
  const { searchState, resultsState, agregarPaquete } = useCotizador();
  const { category } = searchState;
  const {
    hotelSearchResults,
    passSearchResults,
    classSearchResults,
    transferSearchResults,
    equipmentSearchResults,
  } = resultsState;

  return (
    <div id="busqueda" className="space-y-8">
      {hotelSearchResults ||
      passSearchResults ||
      classSearchResults ||
      transferSearchResults ||
      equipmentSearchResults
        ? handleBusqueda(
            category,
            hotelSearchResults,
            passSearchResults,
            classSearchResults,
            transferSearchResults,
            equipmentSearchResults,
            agregarPaquete,
            reglas,
          )
        : null}
    </div>
  );
};

export default SearchResults;
