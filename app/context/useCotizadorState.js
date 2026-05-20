"use client";
import { useReducer, useCallback } from "react";

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
    case "ADD_PAQUETE": {
      const withKey = { ...action.payload, _key: crypto.randomUUID() };
      return {
        ...state,
        paquetesSeleccionados: [...state.paquetesSeleccionados, withKey],
        originales: [...state.originales, withKey],
      };
    }
    case "REMOVE_PAQUETE":
      return {
        ...state,
        paquetesSeleccionados: state.paquetesSeleccionados.filter((_, i) => i !== action.payload),
        originales: state.originales.filter((_, i) => i !== action.payload),
      };
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
};

// Custom hook
export const useCotizadorState = () => {
  const [searchState, dispatchSearch] = useReducer(searchReducer, initialSearchState);
  const [resultsState, dispatchResults] = useReducer(resultsReducer, initialResultsState);
  const [cartState, dispatchCart] = useReducer(cartReducer, initialCartState);

  // Action creators for search state
  // useCallback gives stable references — safe to use as useEffect deps in children
  const setStartDate = useCallback(
    (date) => dispatchSearch({ type: "SET_START_DATE", payload: date }),
    [dispatchSearch],
  );
  const setBusqueda = useCallback(
    (search) => dispatchSearch({ type: "SET_BUSQUEDA", payload: search }),
    [dispatchSearch],
  );
  const setCerro = useCallback(
    (centro) => dispatchSearch({ type: "SET_CERRO", payload: centro }),
    [dispatchSearch],
  );
  const setCategory = useCallback(
    (cat) => dispatchSearch({ type: "SET_CATEGORY", payload: cat }),
    [dispatchSearch],
  );

  // Action creators for results state
  const setHotelSearchResults = useCallback(
    (results) => dispatchResults({ type: "SET_HOTEL_RESULTS", payload: results }),
    [dispatchResults],
  );
  const setPassSearchResults = useCallback(
    (results) => dispatchResults({ type: "SET_PASS_RESULTS", payload: results }),
    [dispatchResults],
  );
  const setClassSearchResults = useCallback(
    (results) => dispatchResults({ type: "SET_CLASS_RESULTS", payload: results }),
    [dispatchResults],
  );
  const setTransferSearchResults = useCallback(
    (results) => dispatchResults({ type: "SET_TRANSFER_RESULTS", payload: results }),
    [dispatchResults],
  );
  const setEquipmentSearchResults = useCallback(
    (results) => dispatchResults({ type: "SET_EQUIPMENT_RESULTS", payload: results }),
    [dispatchResults],
  );

  // Action creators for cart state
  // useCallback garantiza referencias estables → evita loops en useEffects que las tengan como dep
  const agregarPaquete = useCallback(
    (paquete) => dispatchCart({ type: "ADD_PAQUETE", payload: paquete }),
    [dispatchCart],
  );
  const eliminarPaquete = useCallback(
    (index) => dispatchCart({ type: "REMOVE_PAQUETE", payload: index }),
    [dispatchCart],
  );
  const setPaquetesSeleccionados = useCallback(
    (paquetes) => dispatchCart({ type: "SET_PAQUETES_SELECCIONADOS", payload: paquetes }),
    [dispatchCart],
  );
  const setOriginales = useCallback(
    (paquetes) => dispatchCart({ type: "SET_ORIGINALES", payload: paquetes }),
    [dispatchCart],
  );

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
