import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { XIcon } from "./svg/svg";
import Passport from "/public/Passport.png";
import AnimatedDropdown from "./ui/animated-dropdown";
import {
  formatNumberPercentage,
  formatNumberWithDots,
  formatReglas,
  verificarFamilyPlan,
} from "../lib/utils/extras";
import { generatePDF } from "../lib/utils/pdf";

const ResumenPresupuesto = ({
  paquetesSeleccionados,
  setPaquetesSeleccionados,
  totalCompra,
  agregarPaquete,
  eliminarPaquete,
  busqueda,
  originales,
  cerro,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [discount, setDiscount] = useState();
  const [clientName, setClientName] = useState("");
  const [total, setTotal] = useState({ pesos: 0, dolares: 0 });
  const [familyPlan, setFamilyPlan] = useState(false);
  const [fpActivado, setFpActivado] = useState(false);
  const [isChecked, setIsChecked] = useState(null);
  const [flag, setFlag] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editItem, setEditItem] = useState({ name: "", price: 0, count: 1 });
  const [editOb, setEditOb] = useState("");
  const [ocultarPrecios, setOcultarPrecios] = useState(false);

  const [editObservacionIndex, setEditObservacionIndex] = useState(null);

  const handleToggle = () => {
    setIsChecked((prevState) => !prevState);
    if (isChecked === true) {
      setFpActivado(true);
    } else {
      setFlag(true);
    }
  };

  const handleDiscount = (e) => {
    const descuento = parseInt(e.target.value) || 0;

    setDiscount(descuento);
    setPaquetesSeleccionados((prev) =>
      prev.map((paquete) =>
        paquete.seccion === "alojamiento"
          ? { ...paquete, discount: (paquete.price * descuento) / 100 }
          : paquete
      )
    );
  };

  useEffect(() => {
    const paquetesTemp = [...paquetesSeleccionados];
    //console.log(paquetesTemp);
    if (flag) {
      verificarFamilyPlan(
        paquetesTemp,
        isChecked,
        setFamilyPlan,
        setPaquetesSeleccionados,
        setFlag,
        setIsChecked
      );
    }

    if (familyPlan && fpActivado) {
      const nuevosPaquetes = JSON.parse(JSON.stringify(originales));
      setPaquetesSeleccionados(nuevosPaquetes);
      setFpActivado(false);
      setFlag(false);
    }
  }, [
    paquetesSeleccionados,
    familyPlan,
    setPaquetesSeleccionados,
    flag,
    isChecked,
    fpActivado,
    originales,
  ]);

  useEffect(() => {
    const { totalPesos, totalDolares } = paquetesSeleccionados.reduce(
      (acumulador, paquete) => {
        console.log(paquete);
        const precioFinal = paquete.price - (paquete.discount ? paquete.discount : 0);
        console.log(precioFinal);

        if (paquete.seccion === "alojamiento" && paquete.moneda === "USD") {
          acumulador.totalDolares += precioFinal;
        } else {
          acumulador.totalPesos += precioFinal;
        }

        return acumulador;
      },
      { totalPesos: 0, totalDolares: 0 }
    );

    setTotal({ pesos: totalPesos, dolares: totalDolares });
  }, [setTotal, paquetesSeleccionados]);

  return (
    <div className="bg-card rounded-lg shadow-lg h-fit mt-4">
      <div className="p-4 sm:p-6 md:p-8 border-b">
        <h2 className="text-xl font-bold mb-2">Presupuesto</h2>
      </div>
      <div className=" flex items-start justify-between bg-gray-100 p-4 md:items-center">
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
      <div className="p-4 sm:p-6 md:p-8 space-y-4">
        <div className="pb-2">
          <div id="pdf-content">
            {paquetesSeleccionados.map((paquete, index) => (
              <div key={index} className="flex items-center justify-between py-1">
                {paquete.seccion === "clases" ||
                paquete.seccion === "equipos" ||
                paquete.seccion === "pases" ||
                paquete.seccion === "item" ? (
                  <span>
                    {paquete.name} {paquete.count && `x ${paquete.count} personas`}
                  </span>
                ) : (
                  <div className="flex flex-col w-4/5">
                    <span className={`${paquete.promo ? "text-gray-500" : null}`}>
                      {paquete.name}
                    </span>
                    {paquete.seccion === "transporte" && (
                      <span className="text-gray-500 text-xs w-[80%] text-pretty pl-1">
                        {paquete.clave
                          ? paquete.clave === "ida"
                            ? paquete.fechaInicio
                            : paquete.fechaFin
                          : paquete.fechaInicio + "-" + paquete.fechaFin}
                      </span>
                    )}
                    {paquete.seccion === "alojamiento" && (
                      <span
                        className="text-gray-500 text-xs w-[80%] text-pretty pl-1"
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        {formatReglas(paquete.reglas)}
                      </span>
                    )}
                  </div>
                )}
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-end gap-3">
                    {paquete.seccion !== "observacion" && (
                      <span className="flex gap-1">
                        <span>{paquete.moneda === "USD" ? "USD " : "$ "}</span>
                        {paquete.discount > 0
                          ? formatNumberWithDots(paquete.price - paquete.discount)
                          : formatNumberWithDots(paquete.price)}
                      </span>
                    )}
                    {paquete.seccion === "item" && (
                      <button
                        onClick={() => {
                          setEditingIndex(index);
                          setEditItem({
                            name: paquete.name,
                            price: paquete.price / paquete.count,
                            count: paquete.count,
                          });
                        }}
                        className="text-black hover:text-blue-600 focus:outline-none"
                        aria-label="Editar paquete"
                      >
                        ✏️
                      </button>
                    )}
                    {paquete.seccion === "observacion" && (
                      <button
                        className="text-sm text-blue-600 hover:underline"
                        onClick={() => {
                          setEditObservacionIndex(index);
                          setEditOb(paquete.name);
                        }}
                      >
                        ✏️
                      </button>
                    )}
                    <button
                      onClick={() => eliminarPaquete(index)}
                      className="text-black hover:text-red-700 focus:outline-none"
                      aria-label="Eliminar paquete"
                    >
                      <XIcon className="h-5 w-5" />
                    </button>
                  </div>
                  {paquete.seccion === "alojamiento" && paquete.discount !== 0 && (
                    <div className="text-gray-500 flex items-center justify-end w-full">
                      <span className="flex gap-1 items-center text-xs">
                        {formatNumberPercentage(paquete.discount, paquete.price)}% OFF ya aplicado
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div className="flex items-center justify-end pt-2 mt-4 border-t">
              <span className="text-2xl font-bold">
                {total.dolares === 0
                  ? `Total: $ ${formatNumberWithDots(total.pesos)}`
                  : `Total: ARS $ ${formatNumberWithDots(
                      total.pesos
                    )} | USD $ ${formatNumberWithDots(total.dolares)}`}{" "}
              </span>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="w-auto bg-blue-500 text-white hover:bg-blue-600"
            >
              Guardar Presupuesto
            </Button>
            {isModalOpen && (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-md animate-fade-in">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                    Guardar presupuesto
                  </h2>

                  <div className="mb-4">
                    <label
                      htmlFor="clientName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nombre del cliente
                    </label>
                    <input
                      type="text"
                      id="clientName"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Ej. Juan Pérez"
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  <div className="mb-6 flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="ocultarPrecios"
                      checked={ocultarPrecios}
                      onChange={() => setOcultarPrecios((prev) => !prev)}
                      className="peer hidden"
                    />
                    <label
                      htmlFor="ocultarPrecios"
                      className="flex items-center cursor-pointer text-sm text-gray-700 peer-checked:font-semibold"
                    >
                      <div className="w-5 h-5 mr-2 border border-gray-400 rounded-sm flex items-center justify-center peer-checked:bg-blue-500">
                        {ocultarPrecios && <span className="text-white text-sm">✓</span>}
                      </div>
                      Ocultar precios en PDF
                    </label>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() =>
                        generatePDF(
                          paquetesSeleccionados,
                          total.pesos,
                          total.dolares,
                          busqueda,
                          Passport,
                          clientName,
                          ocultarPrecios
                        )
                      }
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                      Aceptar
                    </button>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {editObservacionIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-md animate-fade-in">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Editar observación
            </h2>
            <textarea
              value={editOb}
              onChange={(e) => setEditOb(e.target.value)}
              placeholder="Observación (esto aparecerá en el PDF)"
              rows={4}
              className="w-full p-2 mb-4 border rounded resize-none"
            />
            <div className="flex justify-end">
              <button
                onClick={() => {
                  const nuevos = [...paquetesSeleccionados];
                  nuevos[editObservacionIndex] = {
                    ...nuevos[editObservacionIndex],
                    name: editOb,
                  };
                  setPaquetesSeleccionados(nuevos);
                  setEditObservacionIndex(null);
                }}
                className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Guardar
              </button>
              <button
                onClick={() => setEditObservacionIndex(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {editingIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-md animate-fade-in">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Editar ítem</h2>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Nombre</label>
              <input
                type="text"
                value={editItem.name}
                onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre del ítem"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Precio unitario</label>
              <input
                type="number"
                min={0}
                value={editItem.price}
                onChange={(e) => setEditItem({ ...editItem, price: Number(e.target.value) })}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Precio"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Cantidad</label>
              <input
                type="number"
                min={1}
                value={editItem.count}
                onChange={(e) => setEditItem({ ...editItem, count: Number(e.target.value) })}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Cantidad"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => {
                  const nuevos = [...paquetesSeleccionados];
                  nuevos[editingIndex] = {
                    ...nuevos[editingIndex],
                    name: editItem.name,
                    count: editItem.count,
                    price: editItem.price * editItem.count,
                  };
                  setPaquetesSeleccionados(nuevos);
                  setEditingIndex(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Guardar
              </button>
              <button
                onClick={() => setEditingIndex(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumenPresupuesto;
