import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { XIcon } from "../svg/svg";
import { formatNumberWithDots, generatePDF } from "@/app/lib/utils";
import Passport from "/public/Passport.png";
import AnimatedDropdown from "./animated-dropdown";

const ResumenPresupuesto = ({
  paquetesSeleccionados,
  setPaquetesSeleccionados,
  totalCompra,
  eliminarPaquete,
  busqueda,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [clientName, setClientName] = useState("");
  const [total, setTotal] = useState(0);
  const [familyPlan, setFamilyPlan] = useState(false);
  const [fpActivado, setFpActivado] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [flag, setFlag] = useState(true);

  const handleToggle = () => {
    setIsChecked((prevState) => !prevState);
  };

  const handleDiscount = (e) => {
    e.preventDefault();
    const descuento = parseInt(e.target.value) || 0; // Asegúrate de que descuento sea un número válido

    setDiscount(descuento);
    setPaquetesSeleccionados((prevPaquetes) =>
      prevPaquetes.map((paquete) =>
        paquete.seccion === "alojamiento"
          ? {
              ...paquete,
              discount: (paquete.price * descuento) / 100, // Calcula el descuento solo si es válido
            }
          : paquete
      )
    );

    console.log(paquetesSeleccionados, descuento);
  };

  useEffect(() => {
    const total = paquetesSeleccionados.reduce(
      (acumulador, paquete) =>
        acumulador + (paquete.price - (paquete.discount ? paquete.discount : 0)),
      0
    );
    setTotal(total);

    const verificarFamilyPlan = () => {
      const secciones = ["pases", "equipos", "clases"];
      let activarFamilyPlan = false;
      const nuevosPaquetes = [...paquetesSeleccionados];

      secciones.forEach((seccion) => {
        const paquetesPorSeccion = nuevosPaquetes.filter(
          (paquete) => paquete.seccion === seccion && !paquete.promo // Excluye paquetes con promo
        );

        const totalCount = paquetesPorSeccion.reduce((sum, paquete) => sum + paquete.count, 0);

        if (totalCount >= 4 && totalCount <= 6) {
          setFamilyPlan(true);
          activarFamilyPlan = true;

          let restante = totalCount >= 4 && totalCount < 6 ? 1 : 2; // Determina cuántos paquetes necesitamos procesar

          if (isChecked) {
            while (restante > 0) {
              console.log("arranque", restante);
              // Buscar el paquete más barato que no tenga promo
              const paqueteMasBarato = paquetesPorSeccion.reduce((min, paquete) =>
                paquete.price < min.price ? paquete : min
              );

              if (paqueteMasBarato.count > 1) {
                // Si el paquete tiene más de 1, reducimos su count y creamos uno con promo
                paqueteMasBarato.count -= 1;
                nuevosPaquetes.push({
                  ...paqueteMasBarato,
                  count: 1,
                  price: 0, // Precio 0 para paquetes con promo
                  promo: true,
                });

                restante--;
                console.log("nuevos Paquetes", nuevosPaquetes);
                console.log("resta restante", restante);
              } else {
                // Si el paquete tiene count === 1, lo marcamos como promo
                const index = nuevosPaquetes.findIndex((paquete) => paquete === paqueteMasBarato);
                nuevosPaquetes[index] = {
                  ...paqueteMasBarato,
                  price: 0, // Precio 0 para paquetes con promo
                  promo: true,
                };

                // Remover de paquetesPorSeccion para no procesarlo nuevamente
                const seccionIndex = paquetesPorSeccion.findIndex(
                  (paquete) => paquete === paqueteMasBarato
                );
                paquetesPorSeccion.splice(seccionIndex, 1);
                restante--;
                console.log("nuevos Paquetes 2", nuevosPaquetes);
                console.log("resta restante 2", restante);
              }
            }
          }
        }
      });

      // Actualiza el estado solo si es necesario
      if (activarFamilyPlan) {
        setFamilyPlan(true);
        if (isChecked) {
          setPaquetesSeleccionados(nuevosPaquetes);
          setFlag(false);
        }
      } else if (familyPlan) {
        setFamilyPlan(false); // Si no se cumple la condición, desactiva el Family Plan
      }
    };

    if (flag) {
      console.log("entre flag");
      verificarFamilyPlan();
    }
  }, [paquetesSeleccionados, familyPlan, setPaquetesSeleccionados, flag, isChecked]);

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
