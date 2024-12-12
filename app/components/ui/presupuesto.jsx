import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { XIcon } from "../svg/svg";
import { formatNumberWithDots, generatePDF, verificarFamilyPlan } from "@/app/lib/utils";
import Passport from "/public/Passport.png";
import AnimatedDropdown from "./animated-dropdown";

const ResumenPresupuesto = ({
  paquetesSeleccionados,
  setPaquetesSeleccionados,
  totalCompra,
  eliminarPaquete,
  busqueda,
  paquetesOriginales
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [clientName, setClientName] = useState("");
  const [total, setTotal] = useState(0);
  const [familyPlan, setFamilyPlan] = useState(false);
  const [fpActivado, setFpActivado] = useState(false);
  const [isChecked, setIsChecked] = useState(null);
  const [flag, setFlag] = useState(true);

  const handleToggle = () => {
    setIsChecked((prevState) => !prevState);
    if (isChecked === true) {
      setFpActivado(true);
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
    const total = paquetesSeleccionados.reduce(
      (acumulador, paquete) =>
        acumulador + (paquete.price - (paquete.discount ? paquete.discount : 0)),
      0
    );
    setTotal(total);

    verificarFamilyPlan(
      paquetesSeleccionados,
      isChecked,
      setFamilyPlan,
      setPaquetesSeleccionados,
      setFlag,
      familyPlan,
    );

    if (familyPlan && fpActivado) {
      setPaquetesSeleccionados(paquetesOriginales); // Copia profunda
      setFpActivado(false);
      setFamilyPlan(false);
      setFlag(true);
    }
  }, [
    paquetesSeleccionados,
    familyPlan,
    setPaquetesSeleccionados,
    flag,
    isChecked,
    paquetesOriginales,
    fpActivado,
  ]);

  return (
    <div className="bg-card rounded-lg shadow-lg h-fit">
      <div className="p-4 sm:p-6 md:p-8 border-b">
        <h2 className="text-xl font-bold mb-2">Presupuesto</h2>
      </div>
      <div className=" flex items-start justify-between bg-gray-100 p-4 md:items-center">
        <AnimatedDropdown discount={discount} handleDiscount={handleDiscount} />
        {familyPlan && (
          <div className="flex items-center gap-2">
            <span>Family Plan</span>
            <label
              htmlFor="AcceptConditions"
              className="relative inline-block h-8 w-14 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-blue-500"
            >
              <input
                type="checkbox"
                id="AcceptConditions"
                className="peer sr-only pr-4"
                checked={isChecked}
                onChange={handleToggle}
              />

              <span className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-gray-300 ring-[6px] ring-inset ring-white transition-all peer-checked:start-8 peer-checked:w-2 peer-checked:bg-white peer-checked:ring-transparent"></span>
            </label>
          </div>
        )}
      </div>
      <div id="pdf-content" className="p-4 sm:p-6 md:p-8 space-y-4 h-fit">
        <div className="pb-2">
          {paquetesSeleccionados.map((paquete, index) => (
            <div key={index} className="flex items-center justify-between">
              {paquete.seccion !== "alojamiento" || paquete.seccion !== "transporte" ? (
                <span>
                  {paquete.name} - x {paquete.count}
                </span>
              ) : (
                <span className={`${paquete.promo ? "text-gray-500" : null}`}>{paquete.name}</span>
              )}
              {paquete.seccion === "alojamiento" && paquete.discount !== 0 && (
                <span className="ml-2 text-gray-500">Descuento: $ {paquete.discount}</span>
              )}
              <div>
                <span>
                  $
                  {formatNumberWithDots(
                    paquete.discount ? paquete.price - paquete.discount : paquete.price
                  )}
                </span>
                <button
                  onClick={() => eliminarPaquete(index)}
                  className="ml-4 text-black hover:text-red-700 focus:outline-none"
                  aria-label="Eliminar paquete"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-end pt-2 mt-4 border-t">
            <span className="text-2xl font-bold">${formatNumberWithDots(total)}</span>
          </div>
          <div className="flex justify-end pt-4">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="w-auto bg-blue-500 text-white hover:bg-blue-600"
            >
              Guardar Presupuesto
            </Button>
            {isModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded shadow-lg">
                  <h2 className="text-xl font-bold mb-4">Ingrese el nombre del cliente</h2>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Nombre del cliente"
                    className="w-full p-2 mb-4 border rounded"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        generatePDF(
                          paquetesSeleccionados,
                          totalCompra,
                          busqueda,
                          Passport,
                          clientName
                        );
                      }}
                      className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Aceptar
                    </button>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
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
    </div>
  );
};

export default ResumenPresupuesto;
