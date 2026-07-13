"use client";
import { CotizadorContext } from "./CotizadorContext";
import { useCotizadorState } from "./useCotizadorState";

export const CotizadorProvider = ({ children }) => {
  const cotizador = useCotizadorState();

  return <CotizadorContext.Provider value={cotizador}>{children}</CotizadorContext.Provider>;
};
