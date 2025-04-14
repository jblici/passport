import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./button";
import { ChevronRight, ChevronDown } from "lucide-react";

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
  const [name, setName] = useState("");
  const [price, setPrice] = useState();
  const [error, setError] = useState(false);

  const handleItem = () => {
    if (!name || !price || price <= 0) {
      setError(true);
      return;
    }

    agregarPaquete({ name, price });
    setIsItemOpen(false);
    setName("");
    setPrice(0);
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
        className="flex items-center gap-2"
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
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="w-auto bg-blue-500 text-white hover:bg-blue-600"
                >
                  Descuento Alojamiento
                </Button>
                {isModalOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg">
                      <h2 className="text-xl font-bold mb-4">Ingresar % de descuento</h2>
                      <input
                        type="number"
                        min={0}
                        value={discount}
                        onChange={(e) => handleDiscount(e)}
                        placeholder="%"
                        className="w-full p-2 mb-4 border rounded"
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleModal()}
                          className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Aceptar
                        </button>
                        <button
                          onClick={() => handleModal()}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <Button variant="default" onClick={() => setIsItemOpen(true)}>
                  Ingresar Item
                </Button>
                {isItemOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg flex flex-col w-80">
                      <h2 className="text-xl font-bold mb-4">Ingresar Item</h2>

                      <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (error) setError(false);
                        }}
                        placeholder="Nombre del item"
                        className="w-full p-2 mb-2 border rounded"
                      />
                      <input
                        type="number"
                        value={price}
                        min={0}
                        onChange={(e) => {
                          setPrice(Number(e.target.value));
                          if (error) setError(false);
                        }}
                        placeholder="Precio"
                        className="w-full p-2 mb-2 border rounded"
                      />

                      {error && (
                        <span className="text-red-500 text-sm mb-2">
                          * Completá ambos campos correctamente
                        </span>
                      )}

                      <div className="flex justify-end">
                        <button
                          onClick={handleItem}
                          className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Aceptar
                        </button>
                        <button
                          onClick={() => {
                            setIsItemOpen(false);
                            setName("");
                            setPrice(0);
                            setError(false);
                            setIsOpen(false)
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
