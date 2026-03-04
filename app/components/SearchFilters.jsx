import { Button } from "@/app/components/ui/button";
import { handleFormularios } from "@/app/lib/utils/secciones";

const SearchFilters = ({
  category,
  onCategoryChange,
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
}) => {
  return (
    <div className="bg-card rounded-lg shadow-lg h-fit w-full">
      <div className="flex justify-center px-4 pt-4 sm:px-6 md:px-8">
        <div className="space-y-2">
          {["Alojamientos", "Medios de Elevación", "Equipos", "Clases", "Transporte"].map(
            (cat) => (
              <Button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`mx-2 ${category === cat ? "bg-blue-500" : "bg-black"}`}
              >
                {cat}
              </Button>
            )
          )}
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
              setStartDate
            )
          : category && <p className="text-muted-foreground">Loading filters...</p>}
      </div>
    </div>
  );
};

export default SearchFilters;
