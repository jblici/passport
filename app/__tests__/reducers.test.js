import { describe, it, expect } from "vitest";

// ---------------------------------------------------------------------------
// Reducers extraídos de useCotizadorState para testear aislados
// ---------------------------------------------------------------------------

const searchReducer = (state, action) => {
  switch (action.type) {
    case "SET_START_DATE": return { ...state, startDate: action.payload };
    case "SET_BUSQUEDA":   return { ...state, busqueda: action.payload };
    case "SET_CERRO":      return { ...state, cerro: action.payload };
    case "SET_CATEGORY":   return { ...state, category: action.payload };
    default: return state;
  }
};

const resultsReducer = (state, action) => {
  switch (action.type) {
    case "SET_HOTEL_RESULTS":    return { ...state, hotelSearchResults: action.payload };
    case "SET_PASS_RESULTS":     return { ...state, passSearchResults: action.payload };
    case "SET_CLASS_RESULTS":    return { ...state, classSearchResults: action.payload };
    case "SET_TRANSFER_RESULTS": return { ...state, transferSearchResults: action.payload };
    case "SET_EQUIPMENT_RESULTS":return { ...state, equipmentSearchResults: action.payload };
    case "CLEAR_ALL_RESULTS":
      return {
        hotelSearchResults: null,
        passSearchResults: null,
        classSearchResults: null,
        transferSearchResults: null,
        equipmentSearchResults: null,
      };
    default: return state;
  }
};

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
    default: return state;
  }
};

const initialSearchState  = { startDate: null, busqueda: "", cerro: "", category: "Alojamientos" };
const initialResultsState = { hotelSearchResults: null, passSearchResults: null, classSearchResults: null, transferSearchResults: null, equipmentSearchResults: null };
const initialCartState    = { paquetesSeleccionados: [], originales: [] };

// ---------------------------------------------------------------------------
// searchReducer
// ---------------------------------------------------------------------------
describe("searchReducer", () => {
  it("SET_CERRO actualiza cerro", () => {
    const state = searchReducer(initialSearchState, { type: "SET_CERRO", payload: "Catedral" });
    expect(state.cerro).toBe("Catedral");
  });

  it("SET_CATEGORY actualiza category", () => {
    const state = searchReducer(initialSearchState, { type: "SET_CATEGORY", payload: "Equipos" });
    expect(state.category).toBe("Equipos");
  });

  it("SET_START_DATE actualiza startDate", () => {
    const date = new Date(2025, 6, 15);
    const state = searchReducer(initialSearchState, { type: "SET_START_DATE", payload: date });
    expect(state.startDate).toBe(date);
  });

  it("no muta el estado previo", () => {
    const prev = { ...initialSearchState };
    searchReducer(prev, { type: "SET_CERRO", payload: "Chapelco" });
    expect(prev.cerro).toBe("");
  });

  it("acción desconocida devuelve el estado intacto", () => {
    const state = searchReducer(initialSearchState, { type: "UNKNOWN" });
    expect(state).toEqual(initialSearchState);
  });
});

// ---------------------------------------------------------------------------
// resultsReducer
// ---------------------------------------------------------------------------
describe("resultsReducer", () => {
  it("SET_HOTEL_RESULTS guarda los resultados", () => {
    const resultados = [{ id: 1 }];
    const state = resultsReducer(initialResultsState, { type: "SET_HOTEL_RESULTS", payload: resultados });
    expect(state.hotelSearchResults).toEqual(resultados);
    expect(state.passSearchResults).toBeNull(); // los demás no cambian
  });

  it("CLEAR_ALL_RESULTS pone todo en null", () => {
    const withResults = {
      hotelSearchResults: [{ id: 1 }],
      passSearchResults: [{ id: 2 }],
      classSearchResults: [{ id: 3 }],
      transferSearchResults: [{ id: 4 }],
      equipmentSearchResults: [{ id: 5 }],
    };
    const state = resultsReducer(withResults, { type: "CLEAR_ALL_RESULTS" });
    expect(Object.values(state).every((v) => v === null)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// cartReducer
// ---------------------------------------------------------------------------
describe("cartReducer - ADD_PAQUETE", () => {
  const paquete = { seccion: "pases", name: "Pase Adulto", price: 5000, count: 1 };

  it("agrega el paquete al array", () => {
    const state = cartReducer(initialCartState, { type: "ADD_PAQUETE", payload: paquete });
    expect(state.paquetesSeleccionados).toHaveLength(1);
    expect(state.paquetesSeleccionados[0].name).toBe("Pase Adulto");
  });

  it("genera _key único en cada paquete", () => {
    let state = initialCartState;
    state = cartReducer(state, { type: "ADD_PAQUETE", payload: paquete });
    state = cartReducer(state, { type: "ADD_PAQUETE", payload: paquete });
    const [p1, p2] = state.paquetesSeleccionados;
    expect(p1._key).toBeDefined();
    expect(p2._key).toBeDefined();
    expect(p1._key).not.toBe(p2._key);
  });

  it("_key es un UUID válido", () => {
    const state = cartReducer(initialCartState, { type: "ADD_PAQUETE", payload: paquete });
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(state.paquetesSeleccionados[0]._key).toMatch(uuidRegex);
  });

  it("agrega al array originales también", () => {
    const state = cartReducer(initialCartState, { type: "ADD_PAQUETE", payload: paquete });
    expect(state.originales).toHaveLength(1);
    expect(state.originales[0]._key).toBe(state.paquetesSeleccionados[0]._key);
  });

  it("no muta el estado previo", () => {
    const prev = { ...initialCartState, paquetesSeleccionados: [] };
    cartReducer(prev, { type: "ADD_PAQUETE", payload: paquete });
    expect(prev.paquetesSeleccionados).toHaveLength(0);
  });
});

describe("cartReducer - REMOVE_PAQUETE", () => {
  it("elimina por índice correctamente", () => {
    let state = initialCartState;
    state = cartReducer(state, { type: "ADD_PAQUETE", payload: { name: "A" } });
    state = cartReducer(state, { type: "ADD_PAQUETE", payload: { name: "B" } });
    state = cartReducer(state, { type: "ADD_PAQUETE", payload: { name: "C" } });

    state = cartReducer(state, { type: "REMOVE_PAQUETE", payload: 1 }); // elimina "B"
    expect(state.paquetesSeleccionados).toHaveLength(2);
    expect(state.paquetesSeleccionados.map((p) => p.name)).toEqual(["A", "C"]);
  });

  it("los _key del resto no cambian tras eliminación", () => {
    let state = initialCartState;
    state = cartReducer(state, { type: "ADD_PAQUETE", payload: { name: "A" } });
    state = cartReducer(state, { type: "ADD_PAQUETE", payload: { name: "B" } });
    const keyA = state.paquetesSeleccionados[0]._key;

    state = cartReducer(state, { type: "REMOVE_PAQUETE", payload: 1 }); // elimina "B"
    expect(state.paquetesSeleccionados[0]._key).toBe(keyA); // "A" no cambió su key
  });

  it("eliminar el primero desplaza correctamente el índice", () => {
    let state = initialCartState;
    state = cartReducer(state, { type: "ADD_PAQUETE", payload: { name: "X" } });
    state = cartReducer(state, { type: "ADD_PAQUETE", payload: { name: "Y" } });

    state = cartReducer(state, { type: "REMOVE_PAQUETE", payload: 0 });
    expect(state.paquetesSeleccionados[0].name).toBe("Y");
  });
});
