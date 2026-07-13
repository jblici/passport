import { useCotizador } from "@/app/context/CotizadorContext";

const CATEGORIES = [
  { name: "Alojamientos", icon: "🏨" },
  { name: "Medios de Elevación", icon: "🚡" },
  { name: "Equipos", icon: "🎿" },
  { name: "Clases", icon: "👨‍🏫" },
  { name: "Transporte", icon: "🚌" },
];

const SearchFilters = () => {
  const { searchState, setCategory } = useCotizador();
  const { category } = searchState;

  return (
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
                ? "bg-white text-blue-600 shadow-lg scale-105"
                : "bg-blue-400 text-white hover:bg-blue-300 hover:shadow-md"
            }
          `}
        >
          <span className="text-base">{cat.icon}</span>
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default SearchFilters;
