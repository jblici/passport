import React from "react";
import { Button } from "@/app/components/ui/button";
import { XIcon } from "../svg/svg";

const ResumenPresupuesto = ({
  paquetesSeleccionados,
  totalCompra,
  generatePDF,
  eliminarPaquete,
}) => {
  console.log(totalCompra)
  return (
    <div className="bg-card rounded-lg shadow-lg h-fit">
      <div className="p-4 sm:p-6 md:p-8 border-b">
        <h2 className="text-xl font-bold mb-2">Presupuesto</h2>
      </div>
      <div id="pdf-content" className="p-4 sm:p-6 md:p-8 space-y-4 h-fit">
        <div className="pb-2">
          {paquetesSeleccionados.map((paquete, index) => (
            <div key={index} className="flex items-center justify-between">
              <span>{paquete.name}</span>
              <div>
                <span>${paquete.price}</span>
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
          <div className="flex items-center justify-end mt-4 border-t">
            <span className="text-2xl font-bold">${totalCompra}</span>
          </div>
          <div className="flex justify-end pt-4">
            <Button
              onClick={generatePDF}
              className="w-auto bg-blue-500 text-white hover:bg-blue-600"
            >
              Guardar PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumenPresupuesto;
