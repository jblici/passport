"use client";
import { useState, useEffect } from "react";
import { checkFamilyPlanEligibility, applyFamilyPlanDiscount } from "@/app/lib/utils/extras";

const useBudgetState = (originales, paquetesSeleccionados, setPaquetesSeleccionados) => {
  // Budget info
  const [budget, setBudget] = useState({
    clientName: "",
    discount: 0,
    total: { pesos: 0, dolares: 0 },
    shouldHidePrices: false,
    isModalOpen: false,
  });

  // Family plan: isEligible (condiciones cumplidas), isChecked (activado por el usuario)
  const [familyPlan, setFamilyPlan] = useState({
    isEligible: false,
    isChecked: false,
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
    setFamilyPlan((prev) => ({ ...prev, isChecked: !prev.isChecked }));
  };

  const handleDiscount = (e) => {
    const descuento = parseInt(e.target.value) || 0;
    setBudget((prev) => ({ ...prev, discount: descuento }));
  };

  // Recalcular elegibilidad cada vez que cambia la lista base de paquetes
  useEffect(() => {
    const eligible = checkFamilyPlanEligibility(originales);
    setFamilyPlan((prev) => ({
      ...prev,
      isEligible: eligible,
      isChecked: eligible ? prev.isChecked : false, // auto-desactivar si ya no califica
    }));
  }, [originales]);

  // Aplicar descuentos cada vez que cambia el toggle, la elegibilidad, los items, o el porcentaje.
  // setPaquetesSeleccionados se omite de las deps intencionalmente: es un dispatch wrapper estable.
  useEffect(() => {
    if (familyPlan.isChecked && familyPlan.isEligible) {
      setPaquetesSeleccionados(applyFamilyPlanDiscount(originales));
    } else {
      const pct = budget.discount;
      setPaquetesSeleccionados(
        originales.map((paquete) =>
          paquete.seccion === "alojamiento"
            ? { ...paquete, discount: (paquete.price * pct) / 100 }
            : paquete,
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [familyPlan.isChecked, familyPlan.isEligible, originales, budget.discount]);

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

    setBudget((prev) => {
      if (prev.total.pesos === totalPesos && prev.total.dolares === totalDolares) return prev;
      return { ...prev, total: { pesos: totalPesos, dolares: totalDolares } };
    });
  }, [paquetesSeleccionados]);

  // Helper setters for easier state updates
  const updateBudget = (updates) => setBudget((prev) => ({ ...prev, ...updates }));
  const updateFamilyPlan = (updates) => setFamilyPlan((prev) => ({ ...prev, ...updates }));
  const updateItemEditing = (updates) => setItemEditing((prev) => ({ ...prev, ...updates }));
  const updateObservationEditing = (updates) =>
    setObservationEditing((prev) => ({ ...prev, ...updates }));

  return {
    budget,
    updateBudget,
    familyPlan,
    updateFamilyPlan,
    itemEditing,
    updateItemEditing,
    observationEditing,
    updateObservationEditing,
    handleToggle,
    handleDiscount,
  };
};

export default useBudgetState;
