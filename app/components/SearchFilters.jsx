import { handleFormularios } from "@/app/lib/utils/secciones";
import { useCotizador } from "@/app/context/CotizadorContext";

const CATEGORIES = [
  { name: "Alojamientos", icon: "🏨" },
  { name: "Medios de Elevación", icon: "🚡" },
  { name: "Equipos", icon: "🎿" },
  { name: "Clases", icon: "👨‍🏫" },
  { name: "Transporte", icon: "🚌" },
];

const SearchFilters = ({ paquetes, rentals, clases, pases, traslados }) => {
  const {
    searchState,
    setCategory,
    setCerro,
    setBusqueda,
    setStartDate,
    setHotelSearchResults,
    setEquipmentSearchResults,
    setPassSearchResults,
    setClassSearchResults,
    setTransferSearchResults,
  } = useCotizador();

  const { category, cerro, busqueda, startDate } = searchState;

  return (
    <div className="bg-card rounded-lg shadow-lg h-fit w-full">
      <div className="flex justify-center px-4 pt-6 sm:px-6 md:px-8 pb-4">
        <div className="flex flex-wrap gap-3 justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setCategory(cat.name)}
              className={`
                px-4 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ease-in-out
                flex items-center gap-2 whitespace-nowrap
                ${
                  category === cat.name
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                }
              `}
            >
              <span className="text-base">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4 sm:p-6 md:p-8">
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
  );
};

export default SearchFilters;
