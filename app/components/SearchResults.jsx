import { handleBusqueda } from "@/app/lib/utils/secciones";

const SearchResults = ({
  category,
  hotelSearchResults,
  passSearchResults,
  classSearchResults,
  transferSearchResults,
  equipmentSearchResults,
  agregarPaquete,
  reglas,
}) => {
  return (
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
  );
};

export default SearchResults;
