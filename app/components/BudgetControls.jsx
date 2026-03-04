import AnimatedDropdown from "./ui/animated-dropdown";
import { Info } from "lucide-react";

const BudgetControls = ({
  discount,
  handleDiscount,
  agregarPaquete,
  paquetesSeleccionados,
  setPaquetesSeleccionados,
  familyPlan,
  cerro,
  isChecked,
  handleToggle,
}) => {
  return (
    <div className="space-y-4 bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b-2 border-gray-200">
      {/* Discount Section */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <AnimatedDropdown
            discount={discount}
            handleDiscount={handleDiscount}
            agregarPaquete={agregarPaquete}
            paquetesSeleccionados={paquetesSeleccionados}
            setPaquetesSeleccionados={setPaquetesSeleccionados}
          />
        </div>

        {/* Family Plan Section */}
        {familyPlan && cerro === "Las Leñas" && (
          <div className="flex items-center gap-4 border-l-2 border-gray-300 pl-6">
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="familyPlanToggle"
                  className="text-sm font-semibold text-gray-700 flex items-center gap-2 cursor-pointer"
                >
                  Family Plan
                  <span className="group relative">
                    <Info size={16} className="text-blue-500 hover:text-blue-600" />
                    <div className="invisible group-hover:visible absolute bottom-full right-0 mb-2 w-48 bg-gray-800 text-white text-xs rounded-md p-2 z-10 whitespace-normal">
                      Descuento especial para familias en Las Leñas. Aplica a grupos de 4+ personas.
                    </div>
                  </span>
                </label>
                <span className="text-xs text-gray-500">
                  {isChecked ? "✓ Activado" : "Desactivado"}
                </span>
              </div>

              <label
                htmlFor="familyPlanToggle"
                className="relative inline-block h-8 w-14 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-green-500"
              >
                <input
                  type="checkbox"
                  id="familyPlanToggle"
                  className="peer sr-only"
                  checked={isChecked}
                  onChange={handleToggle}
                />

                <span className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-white ring-2 ring-gray-400 transition-all peer-checked:start-7 peer-checked:ring-green-600 peer-checked:bg-white"></span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Info Bar */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded text-sm text-gray-700">
        <div className="flex items-start gap-2">
          <Info size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
          <span>
            Ajusta el porcentaje de descuento y activa opciones especiales. Los cambios se aplicarán al presupuesto automáticamente.
          </span>
        </div>
      </div>
    </div>
  );
};

export default BudgetControls;
