import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./button";
import { ChevronRight, ChevronDown } from "lucide-react";
import { formatNumberWithDots } from "@/app/lib/utils/extras";

const dropdownVariants = {
  open: { height: "auto", opacity: 1, y: 0 },
  closed: { height: 0, opacity: 0, y: -20 },
};

export default function AnimatedDropdown({ discount, handleDiscount, agregarPaquete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isItemOpen, setIsItemOpen] = useState(false);
  const [isObservacionOpen, setIsObservacionOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState(false);
  const [count, setCount] = useState("");
  const [observacion, setObservacion] = useState("");

  const handleItem = () => {
    if (!name || price <= 0 || count <= 0) {
      setError(true);
      return;
    }

    agregarPaquete({
      seccion: "item",
      name,
      price: price * count,
      count,
    });

    setIsItemOpen(false);
    setName("");
    setPrice(0);
    setCount(1);
    setError(false);
  };

  const handleObservation = () => {
    if (!observacion) {
      setError(true);
      return;
    }

    agregarPaquete({
      seccion: "observacion",
      name: observacion,
      price: 0,
      count: 0,
    });

    setIsObservacionOpen(false);
    setObservacion("");
    setError(false);
  };

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleModal = () => {
    setIsModalOpen(false);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        onClick={toggleDropdown}
        variant="default"
        className={`flex items-center gap-2 ${isOpen && "bg-blue-500"}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Agregar
        <ChevronRight className="h-4 w-4 transition-transform duration-200 rotate-90 md:rotate-0 md:block hidden" />
        <ChevronDown className="h-4 w-4 transition-transform duration-200 md:hidden" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.3 }}
            className="absolute left-0 top-full mt-2 flex overflow-hidden flex-col z-10"
          >
            <div className="flex flex-col space-y-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
              <Button onClick={() => { setIsModalOpen(true); setIsOpen(false); }} variant="secondary" className="w-full justify-start">
                Descuento Alojamiento
              </Button>
              <Button variant="secondary" onClick={() => { setIsItemOpen(true); setIsOpen(false); }} className="w-full justify-start">
                Item
              </Button>
              <Button variant="secondary" onClick={() => { setIsObservacionOpen(true); setIsOpen(false); }} className="w-full justify-start">
                Observación
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Descuento — fuera del dropdown para que no se desmonte al cerrarlo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-[90%] max-w-md animate-fade-in border border-gray-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Descuento Alojamiento</h2>
              <p className="text-sm text-gray-600 mt-1">Ingresa el porcentaje de descuento a aplicar</p>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Porcentaje de descuento (%)
              </label>
              <input
                type="number"
                min={0}
                value={discount}
                onChange={(e) => handleDiscount(e)}
                placeholder="0"
                className="w-full p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={handleModal}>Cancelar</Button>
              <Button variant="primary" onClick={handleModal}>Aceptar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ítem */}
      {isItemOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-[90%] max-w-md animate-fade-in border border-gray-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Agregar Ítem</h2>
              <p className="text-sm text-gray-600 mt-1">Crea un ítem personalizado para el presupuesto</p>
            </div>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); if (error) setError(false); }}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej. Servicio adicional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Precio unitario</label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => {
                    const parsed = Number(e.target.value.replace(/\./g, ""));
                    setPrice(parsed);
                    if (error) setError(false);
                  }}
                  onBlur={(e) => {
                    const parsed = Number(e.target.value.replace(/\./g, ""));
                    if (!isNaN(parsed)) e.target.value = formatNumberWithDots(parsed);
                  }}
                  onFocus={(e) => { e.target.value = price.toString(); }}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
                <input
                  type="number"
                  min={1}
                  value={count}
                  onChange={(e) => { setCount(Number(e.target.value)); if (error) setError(false); }}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsItemOpen(false)}>Cancelar</Button>
              <Button variant="primary" onClick={handleItem}>Guardar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Observación */}
      {isObservacionOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-[90%] max-w-md animate-fade-in border border-gray-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Agregar Observación</h2>
              <p className="text-sm text-gray-600 mt-1">Esta observación aparecerá en el PDF del presupuesto</p>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Observación</label>
              <textarea
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
                placeholder="Ingresa notas adicionales..."
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => { setIsObservacionOpen(false); setObservacion(""); setError(false); }}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleObservation}>Guardar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
