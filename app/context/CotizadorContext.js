"use client";
import { createContext, useContext } from "react";

export const CotizadorContext = createContext();

export const useCotizador = () => {
  const context = useContext(CotizadorContext);
  if (!context) {
    throw new Error("useCotizador must be used within CotizadorProvider");
  }
  return context;
};
