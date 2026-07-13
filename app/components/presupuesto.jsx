import Passport from "/public/Passport.png";
import { generatePDF } from "../lib/utils/pdf";
import useBudgetState from "../lib/hooks/useBudgetState";
import BudgetControls from "./BudgetControls";
import BudgetItems from "./BudgetItems";
import BudgetSummary from "./BudgetSummary";
import { Button } from "./ui/button";
import { useCotizador } from "@/app/context/CotizadorContext";

const ResumenPresupuesto = () => {
  const { searchState, cartState, setPaquetesSeleccionados, eliminarPaquete, agregarPaquete } = useCotizador();
  const { busqueda, cerro } = searchState;
  const { paquetesSeleccionados, originales } = cartState;

  const {
    budget,
    updateBudget,
    familyPlan,
    updateFamilyPlan,
    itemEditing,
    updateItemEditing,
    observationEditing,
    updateObservationEditing,
    handleToggle,
    handleDiscount,
  } = useBudgetState(originales, paquetesSeleccionados, setPaquetesSeleccionados);

  return (
    <div className="bg-card rounded-lg shadow-lg h-fit mt-4">
      <div className="p-2 sm:p-4 border-b">
        <h2 className="text-xl font-bold mb-2">Presupuesto</h2>
      </div>
      <BudgetControls
        discount={budget.discount}
        handleDiscount={handleDiscount}
        agregarPaquete={agregarPaquete}
        paquetesSeleccionados={paquetesSeleccionados}
        setPaquetesSeleccionados={setPaquetesSeleccionados}
        familyPlan={familyPlan}
        cerro={cerro}
        handleToggle={handleToggle}
      />
      <div className="p-2 sm:p-4 space-y-4">
        <BudgetItems
          paquetesSeleccionados={paquetesSeleccionados}
          eliminarPaquete={eliminarPaquete}
          updateItemEditing={updateItemEditing}
          updateObservationEditing={updateObservationEditing}
        />
        <BudgetSummary
          total={budget.total}
          onSaveClick={() => updateBudget({ isModalOpen: true })}
        />
      </div>
      {budget.isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-md animate-fade-in">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Guardar presupuesto
            </h2>

            <div className="mb-4">
              <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del cliente
              </label>
              <input
                type="text"
                id="clientName"
                value={budget.clientName}
                onChange={(e) => updateBudget({ clientName: e.target.value })}
                placeholder="Ej. Juan Pérez"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mb-6 flex items-center gap-3">
              <input
                type="checkbox"
                id="shouldHidePrices"
                checked={budget.shouldHidePrices}
                onChange={() => updateBudget({ shouldHidePrices: !budget.shouldHidePrices })}
                className="peer hidden"
              />
              <label
                htmlFor="shouldHidePrices"
                className="flex items-center cursor-pointer text-sm text-gray-700"
              >
                <div
                  className={`w-5 h-5 mr-2 border border-gray-400 rounded-sm flex items-center justify-center ${
                    budget.shouldHidePrices ? "bg-blue-500" : "bg-white"
                  }`}
                >
                  {budget.shouldHidePrices && (
                    <span className="text-white text-sm font-bold">✓</span>
                  )}
                </div>
                <span className={budget.shouldHidePrices ? "font-semibold" : ""}>
                  Ocultar precios en PDF
                </span>
              </label>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="primary"
                onClick={() =>
                  generatePDF(
                    paquetesSeleccionados,
                    budget.total.pesos,
                    budget.total.dolares,
                    busqueda,
                    Passport,
                    budget.clientName,
                    budget.shouldHidePrices,
                  )
                }
              >
                Aceptar
              </Button>
              <Button
                variant="secondary"
                onClick={() => updateBudget({ isModalOpen: false })}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
      {observationEditing.isOpen && observationEditing.index !== null && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-md animate-fade-in">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Editar observación
            </h2>
            <textarea
              value={observationEditing.text}
              onChange={(e) => updateObservationEditing({ text: e.target.value })}
              placeholder="Observación (esto aparecerá en el PDF)"
              rows={4}
              className="w-full p-2 mb-4 border rounded resize-none"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="primary"
                onClick={() => {
                  const nuevos = [...paquetesSeleccionados];
                  nuevos[observationEditing.index] = {
                    ...nuevos[observationEditing.index],
                    name: observationEditing.text,
                  };
                  setPaquetesSeleccionados(nuevos);
                  updateObservationEditing({ isOpen: false, index: null, text: "" });
                }}
              >
                Guardar
              </Button>
              <Button
                variant="secondary"
                onClick={() => updateObservationEditing({ isOpen: false, index: null, text: "" })}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
      {itemEditing.isOpen && itemEditing.index !== null && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-md animate-fade-in">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Editar ítem</h2>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Nombre</label>
              <input
                type="text"
                value={itemEditing.item.name}
                onChange={(e) =>
                  updateItemEditing({ item: { ...itemEditing.item, name: e.target.value } })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre del ítem"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Precio unitario</label>
              <input
                type="number"
                min={0}
                value={itemEditing.item.price}
                onChange={(e) =>
                  updateItemEditing({
                    item: { ...itemEditing.item, price: Number(e.target.value) },
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Precio"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Cantidad</label>
              <input
                type="number"
                min={1}
                value={itemEditing.item.count}
                onChange={(e) =>
                  updateItemEditing({
                    item: { ...itemEditing.item, count: Number(e.target.value) },
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Cantidad"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="primary"
                onClick={() => {
                  const nuevos = [...paquetesSeleccionados];
                  nuevos[itemEditing.index] = {
                    ...nuevos[itemEditing.index],
                    name: itemEditing.item.name,
                    count: itemEditing.item.count,
                    price: itemEditing.item.price * itemEditing.item.count,
                  };
                  setPaquetesSeleccionados(nuevos);
                  updateItemEditing({
                    isOpen: false,
                    index: null,
                    item: { name: "", price: 0, count: 1 },
                  });
                }}
              >
                Guardar
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  updateItemEditing({
                    isOpen: false,
                    index: null,
                    item: { name: "", price: 0, count: 1 },
                  })
                }
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumenPresupuesto;
