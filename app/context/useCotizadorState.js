"use client";
import { useReducer } from "react";

// Search state reducer - maneja filtros de búsqueda
const searchReducer = (state, action) => {
  switch (action.type) {
    case "SET_START_DATE":
      return { ...state, startDate: action.payload };
    case "SET_BUSQUEDA":
      return { ...state, busqueda: action.payload };
    case "SET_CERRO":
      return { ...state, cerro: action.payload };
    case "SET_CATEGORY":
      return { ...state, category: action.payload };
    default:
      return state;
  }
};

// Results state reducer - maneja resultados de búsqueda
const resultsReducer = (state, action) => {
  switch (action.type) {
    case "SET_HOTEL_RESULTS":
      return { ...state, hotelSearchResults: action.payload };
    case "SET_PASS_RESULTS":
      return { ...state, passSearchResults: action.payload };
    case "SET_CLASS_RESULTS":
      return { ...state, classSearchResults: action.payload };
    case "SET_TRANSFER_RESULTS":
      return { ...state, transferSearchResults: action.payload };
    case "SET_EQUIPMENT_RESULTS":
      return { ...state, equipmentSearchResults: action.payload };
    case "CLEAR_ALL_RESULTS":
      return {
        hotelSearchResults: null,
        passSearchResults: null,
        classSearchResults: null,
        transferSearchResults: null,
        equipmentSearchResults: null,
      };
    default:
      return state;
  }
};

// Cart state reducer - maneja paquetes seleccionados
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_PAQUETE":
      return {
        ...state,
        paquetesSeleccionados: [...state.paquetesSeleccionados, action.payload],
        originales: [...state.originales, action.payload],
        totalCompra: state.totalCompra + action.payload.price,
      };
    case "REMOVE_PAQUETE": {
      const paqueteEliminado = state.paquetesSeleccionados[action.payload];
      return {
        ...state,
        paquetesSeleccionados: state.paquetesSeleccionados.filter((_, i) => i !== action.payload),
        originales: state.originales.filter((_, i) => i !== action.payload),
        totalCompra: state.totalCompra - paqueteEliminado.price,
      };
    }
    case "SET_PAQUETES_SELECCIONADOS":
      return { ...state, paquetesSeleccionados: action.payload };
    case "SET_ORIGINALES":
      return { ...state, originales: action.payload };
    default:
      return state;
  }
};

// Initial states
const initialSearchState = {
  startDate: null,
  busqueda: "",
  cerro: "",
  category: "Alojamientos",
};

const initialResultsState = {
  hotelSearchResults: null,
  passSearchResults: null,
  classSearchResults: null,
  transferSearchResults: null,
  equipmentSearchResults: null,
};

const initialCartState = {
  paquetesSeleccionados: [],
  originales: [],
  totalCompra: 0,
};

// Custom hook
export const useCotizadorState = () => {
  const [searchState, dispatchSearch] = useReducer(searchReducer, initialSearchState);
  const [resultsState, dispatchResults] = useReducer(resultsReducer, initialResultsState);
  const [cartState, dispatchCart] = useReducer(cartReducer, initialCartState);

  // Action creators for search state
  const setStartDate = (date) => dispatchSearch({ type: "SET_START_DATE", payload: date });
  const setBusqueda = (search) => dispatchSearch({ type: "SET_BUSQUEDA", payload: search });
  const setCerro = (centro) => dispatchSearch({ type: "SET_CERRO", payload: centro });
  const setCategory = (cat) => dispatchSearch({ type: "SET_CATEGORY", payload: cat });

  // Action creators for results state
  const setHotelSearchResults = (results) =>
    dispatchResults({ type: "SET_HOTEL_RESULTS", payload: results });
  const setPassSearchResults = (results) =>
    dispatchResults({ type: "SET_PASS_RESULTS", payload: results });
  const setClassSearchResults = (results) =>
    dispatchResults({ type: "SET_CLASS_RESULTS", payload: results });
  const setTransferSearchResults = (results) =>
    dispatchResults({ type: "SET_TRANSFER_RESULTS", payload: results });
  const setEquipmentSearchResults = (results) =>
    dispatchResults({ type: "SET_EQUIPMENT_RESULTS", payload: results });

  // Action creators for cart state
  const agregarPaquete = (paquete) => dispatchCart({ type: "ADD_PAQUETE", payload: paquete });
  const eliminarPaquete = (index) => dispatchCart({ type: "REMOVE_PAQUETE", payload: index });
  const setPaquetesSeleccionados = (paquetes) =>
    dispatchCart({ type: "SET_PAQUETES_SELECCIONADOS", payload: paquetes });
  const setOriginales = (paquetes) => dispatchCart({ type: "SET_ORIGINALES", payload: paquetes });

  return {
    // Search state and actions
    searchState,
    setStartDate,
    setBusqueda,
    setCerro,
    setCategory,

    // Results state and actions
    resultsState,
    setHotelSearchResults,
    setPassSearchResults,
    setClassSearchResults,
    setTransferSearchResults,
    setEquipmentSearchResults,

    // Cart state and actions
    cartState,
    agregarPaquete,
    eliminarPaquete,
    setPaquetesSeleccionados,
    setOriginales,
  };
};
