import React, {useState} from "react";
import { Button } from "@/app/components/ui/button";
import { XIcon } from "../svg/svg";
import { formatNumberWithDots, generatePDF } from "@/app/lib/utils";
import Passport from "/public/Passport.png";

const ResumenPresupuesto = ({ paquetesSeleccionados, totalCompra, eliminarPaquete, busqueda }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientName, setClientName] = useState('');

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
                <span>${formatNumberWithDots(paquete.price)}</span>
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
            <span className="text-2xl font-bold">${formatNumberWithDots(totalCompra)}</span>
          </div>
          <div className="flex justify-end pt-4">
            <Button onClick={() => setIsModalOpen(true)} className="w-auto bg-blue-500 text-white hover:bg-blue-600">
              Guardar Presupuesto</Button> 
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
                        generatePDF(paquetesSeleccionados, totalCompra, busqueda, Passport, clientName);
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
