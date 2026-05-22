import { XIcon } from "./svg/svg";
import { formatNumberWithDots, formatReglas, formatNumberPercentage } from "@/app/lib/utils/extras";
import { Button } from "./ui/button";

const SECTION_EMOJIS = {
  alojamiento: "🏨",
  pases: "🚡",
  equipos: "🎿",
  clases: "👨‍🏫",
  transporte: "🚌",
  item: "📌",
  observacion: "📝",
};

const getSectionEmoji = (seccion) => SECTION_EMOJIS[seccion] || "📦";

const BudgetItems = ({
  paquetesSeleccionados,
  eliminarPaquete,
  updateItemEditing,
  updateObservationEditing,
}) => {

  return (
    <div id="pdf-content" className="space-y-3">
      {paquetesSeleccionados.map((paquete, index) => (
          <div
            key={paquete._key}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            {/* Header with section and name */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{getSectionEmoji(paquete.seccion)}</span>
                  <span className="font-semibold text-gray-800">{paquete.name}</span>
                  {paquete.count > 1 && paquete.seccion !== "alojamiento" && (
                    <span className="text-sm text-gray-500">x {paquete.count}</span>
                  )}
                </div>

                {/* Details based on section */}
                {paquete.seccion === "transporte" && (
                  <p className="text-xs text-gray-600 ml-6">
                    {paquete.clave
                      ? paquete.clave === "ida"
                        ? `Ida: ${paquete.fechaInicio}`
                        : `Vuelta: ${paquete.fechaFin}`
                      : `${paquete.fechaInicio} a ${paquete.fechaFin}`}
                  </p>
                )}
                {paquete.seccion === "alojamiento" && (
                  <p className="text-xs text-gray-600 ml-6 whitespace-pre-wrap">
                    {formatReglas(paquete.reglas)}
                  </p>
                )}
              </div>

              {/* Price and actions */}
              <div className="flex flex-col items-end gap-2 ml-4">
                {paquete.seccion !== "observacion" && (
                  <span className="text-lg font-bold text-blue-600">
                    {paquete.moneda === "USD" ? "USD " : "$ "}
                    {paquete.discount > 0
                      ? formatNumberWithDots(paquete.price - paquete.discount)
                      : formatNumberWithDots(paquete.price)}
                  </span>
                )}

                {/* Discount badge */}
                {paquete.seccion === "alojamiento" && paquete.discount > 0 && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    {formatNumberPercentage(paquete.discount, paquete.price)}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              {paquete.seccion === "item" && (
                <Button
                  variant="secondary"
                  size="sm"
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
                >
                  ✏️ Editar
                </Button>
              )}
              {paquete.seccion === "observacion" && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    updateObservationEditing({
                      isOpen: true,
                      index,
                      text: paquete.name,
                    });
                  }}
                >
                  ✏️ Editar
                </Button>
              )}
              <Button
                variant="danger"
                size="sm"
                onClick={() => eliminarPaquete(index)}
              >
                🗑️ Eliminar
              </Button>
            </div>
          </div>
      ))}
    </div>
  );
};

export default BudgetItems;
