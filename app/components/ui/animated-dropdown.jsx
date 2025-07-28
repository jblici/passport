import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./button";
import { ChevronRight, ChevronDown } from "lucide-react";
import { formatNumberWithDots } from "@/app/lib/utils/extras";

const dropdownVariants = {
  desktop: {
    open: { width: "auto", opacity: 1, x: 0 },
    closed: { width: 0, opacity: 0, x: -20 },
  },
  mobile: {
    open: { height: "auto", opacity: 1, y: 0 },
    closed: { height: 0, opacity: 0, y: -20 },
  },
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
      seccion: `item`,
      name: `${name}`,
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
    console.log("agregue observacion");

    agregarPaquete({
      seccion: `observacion`,
      name: observacion,
      price: 0,
      count: 0,
    });

    setIsObservacionOpen(false);
    setObservacion("");
    setError(false);
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleModal = () => {
    setIsModalOpen(false);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        onClick={toggleDropdown}
        variant="default"
        className={`flex items-center gap-2 ${isOpen & "bg-blue-500"}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Agregar
        <ChevronRight className="h-4 w-4 transition-transform duration-200 rotate-90 md:rotate-0 md:block hidden" />
        <ChevronDown className="h-4 w-4 transition-transform duration-200 md:hidden" />
      </Button>
      <AnimatePresence>
        {isOpen && (
          <React.Fragment>
            {/* Desktop version - animates to the right */}
            <motion.div
              variants={dropdownVariants.desktop}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ duration: 0.3 }}
              className="absolute left-full top-0 ml-2 hidden md:flex overflow-hidden whitespace-nowrap"
            >
              <div className="flex space-x-2">
                <Button onClick={() => setIsModalOpen(true)} variant="default">
                  Descuento Alojamiento
                </Button>
                {isModalOpen && (
                  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-md animate-fade-in">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                        Ingresar % de descuento
                      </h2>

                      <input
                        type="number"
                        min={0}
                        value={discount}
                        onChange={(e) => handleDiscount(e)}
                        placeholder="%"
                        className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => handleModal()}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                          Aceptar
                        </button>
                        <button
                          onClick={() => handleModal()}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <Button variant="default" onClick={() => setIsItemOpen(true)}>
                  Item
                </Button>
                {isItemOpen && (
                  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-md animate-fade-in">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                        Agregar ítem
                      </h2>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-600">Nombre</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (error) setError(false);
                          }}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nombre del ítem"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-600">
                          Precio unitario
                        </label>
                        <input
                          type="text"
                          min={0}
                          value={price}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/\./g, ""); // quitar puntos si vienen
                            const parsed = Number(raw);
                            setPrice(parsed);
                            if (error) setError(false);
                          }}
                          onBlur={(e) => {
                            // Formatear con puntos al salir del input si querés
                            const raw = e.target.value.replace(/\./g, "");
                            const parsed = Number(raw);
                            if (!isNaN(parsed)) {
                              e.target.value = formatNumberWithDots(parsed);
                            }
                          }}
                          onFocus={(e) => {
                            // Mostrar el valor sin puntos al enfocar
                            e.target.value = price.toString();
                          }}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Precio"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-600">Cantidad</label>
                        <input
                          type="number"
                          min={1}
                          value={count}
                          onChange={(e) => {
                            setCount(Number(e.target.value));
                            if (error) setError(false);
                          }}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Cantidad"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-4">
                        <button
                          onClick={handleItem}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => setIsItemOpen(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <Button variant="default" onClick={() => setIsObservacionOpen(true)}>
                  Observación
                </Button>
                {isObservacionOpen && (
                  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-md animate-fade-in">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                        Agregar Observacion
                      </h2>
                      <textarea
                        value={observacion}
                        onChange={(e) => setObservacion(e.target.value)}
                        placeholder="Observación (esto aparecerá en el PDF)"
                        rows={4}
                        className="w-full p-2 mb-4 border rounded resize-none"
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={handleObservation}
                          className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Aceptar
                        </button>
                        <button
                          onClick={() => {
                            setIsObservacionOpen(false);
                            setObservacion("");
                            setError(false);
                          }}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </React.Fragment>
        )}
      </AnimatePresence>
    </div>
  );
}
