import AnimatedDropdown from "./ui/animated-dropdown";

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
    <div className="flex items-start justify-between bg-gray-100 p-4 md:items-center">
      <AnimatedDropdown
        discount={discount}
        handleDiscount={handleDiscount}
        agregarPaquete={agregarPaquete}
        paquetesSeleccionados={paquetesSeleccionados}
        setPaquetesSeleccionados={setPaquetesSeleccionados}
      />
      {familyPlan && cerro === "Las Leñas" && (
        <div className="flex items-center gap-2">
          <span>Activar Family Plan</span>
          <label
            htmlFor="AcceptConditions"
            className="relative inline-block h-8 w-14 cursor-pointer rounded-full bg-red-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-red-500"
          >
            <input
              type="checkbox"
              id="AcceptConditions"
              className="peer sr-only pr-4"
              checked={isChecked}
              onChange={handleToggle}
            />

            <span className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-red-300 ring-[6px] ring-inset ring-white transition-all peer-checked:start-8 peer-checked:w-2 peer-checked:bg-white peer-checked:ring-transparent"></span>
          </label>
        </div>
      )}
    </div>
  );
};

export default BudgetControls;
