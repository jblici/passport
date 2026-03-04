import { handleBusqueda } from "@/app/lib/utils/secciones";
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
    <div id="busqueda" className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
