import { XIcon } from "./svg/svg";
import { formatNumberWithDots, formatReglas, formatNumberPercentage } from "@/app/lib/utils/extras";

const BudgetItems = ({
  paquetesSeleccionados,
  eliminarPaquete,
  updateItemEditing,
  updateObservationEditing,
}) => {
  return (
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
                <span className={`${paquete.promo ? "text-gray-500" : null}`}>{paquete.name}</span>
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
                      updateItemEditing({
                        isOpen: true,
                        index,
                        item: {
                          name: paquete.name,
                          price: paquete.price / paquete.count,
                          count: paquete.count,
                        },
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
                      updateObservationEditing({
                        isOpen: true,
                        index,
                        text: paquete.name,
                      });
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
      </div>
    </div>
  );
};

export default BudgetItems;
