"use client";
import { useState, useEffect } from "react";
import { verificarFamilyPlan } from "@/app/lib/utils/extras";

const useBudgetState = (originales, paquetesSeleccionados, setPaquetesSeleccionados) => {
  // Budget info
  const [budget, setBudget] = useState({
    clientName: "",
    discount: 0,
    total: { pesos: 0, dolares: 0 },
    shouldHidePrices: false,
    isModalOpen: false,
  });

  // Family plan related state
  const [familyPlan, setFamilyPlan] = useState({
    isActive: false,
    isVerified: false,
    isChecked: false,
    shouldVerify: true,
  });

  // Item editing state
  const [itemEditing, setItemEditing] = useState({
    isOpen: false,
    index: null,
    item: { name: "", price: 0, count: 1 },
  });

  // Observation editing state
  const [observationEditing, setObservationEditing] = useState({
    isOpen: false,
    index: null,
    text: "",
  });

  const handleToggle = () => {
    setFamilyPlan((prevState) => {
      const newIsChecked = !prevState.isChecked;
      return {
        ...prevState,
        isChecked: newIsChecked,
        isActive: newIsChecked === true ? true : prevState.isActive,
        shouldVerify: newIsChecked === false ? true : prevState.shouldVerify,
      };
    });
  };

  const handleDiscount = (e) => {
    const descuento = parseInt(e.target.value) || 0;

    setBudget((prev) => ({
      ...prev,
      discount: descuento,
    }));

    setPaquetesSeleccionados((prev) =>
      prev.map((paquete) =>
        paquete.seccion === "alojamiento"
          ? { ...paquete, discount: (paquete.price * descuento) / 100 }
          : paquete,
      ),
    );
  };

  useEffect(() => {
    const paquetesTemp = [...paquetesSeleccionados];
    if (familyPlan.shouldVerify) {
      verificarFamilyPlan(
        paquetesTemp,
        familyPlan.isChecked,
        (value) => setFamilyPlan((prev) => ({ ...prev, isVerified: value })),
        setPaquetesSeleccionados,
        (value) => setFamilyPlan((prev) => ({ ...prev, shouldVerify: value })),
        (value) => setFamilyPlan((prev) => ({ ...prev, isChecked: value })),
      );
    }
  }, [familyPlan.shouldVerify, paquetesSeleccionados]);

  useEffect(() => {
    if (familyPlan.isVerified && familyPlan.isActive) {
      const nuevosPaquetes = JSON.parse(JSON.stringify(originales));
      setPaquetesSeleccionados(nuevosPaquetes);
      setFamilyPlan((prev) => ({
        ...prev,
        isActive: false,
        shouldVerify: false,
      }));
    }
  }, [familyPlan.isVerified, familyPlan.isActive, originales, setPaquetesSeleccionados]);

  useEffect(() => {
    const { totalPesos, totalDolares } = paquetesSeleccionados.reduce(
      (acumulador, paquete) => {
        const precioFinal = paquete.price - (paquete.discount ? paquete.discount : 0);

        if (paquete.seccion === "alojamiento" && paquete.moneda === "USD") {
          acumulador.totalDolares += precioFinal;
        } else {
          acumulador.totalPesos += precioFinal;
        }

        return acumulador;
      },
      { totalPesos: 0, totalDolares: 0 },
    );

    setBudget((prev) => ({
      ...prev,
      total: { pesos: totalPesos, dolares: totalDolares },
    }));
  }, [paquetesSeleccionados]);

  // Helper setters for easier state updates
  const updateBudget = (updates) => setBudget((prev) => ({ ...prev, ...updates }));
  const updateFamilyPlan = (updates) => setFamilyPlan((prev) => ({ ...prev, ...updates }));
  const updateItemEditing = (updates) => setItemEditing((prev) => ({ ...prev, ...updates }));
  const updateObservationEditing = (updates) =>
    setObservationEditing((prev) => ({ ...prev, ...updates }));

  return {
    // Budget state and setters
    budget,
    updateBudget,
    setBudget,

    // Family plan state and setters
    familyPlan,
    updateFamilyPlan,
    setFamilyPlan,

    // Item editing state and setters
    itemEditing,
    updateItemEditing,
    setItemEditing,

    // Observation editing state and setters
    observationEditing,
    updateObservationEditing,
    setObservationEditing,

    // Handlers
    handleToggle,
    handleDiscount,
  };
};

export default useBudgetState;
