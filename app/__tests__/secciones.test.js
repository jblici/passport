import { describe, it, expect, vi } from "vitest";

// Mock all React component imports inside secciones.jsx so that
// svg.js and other UI files are never loaded during unit tests.
vi.mock("../components/Paquetes/hoteles.jsx", () => ({ default: () => null }));
vi.mock("../components/Paquetes/equipos.jsx", () => ({ default: () => null }));
vi.mock("../components/Paquetes/clases.jsx", () => ({ default: () => null }));
vi.mock("../components/Paquetes/pases.jsx", () => ({ default: () => null }));
vi.mock("../components/Paquetes/transporte.jsx", () => ({ default: () => null }));
vi.mock("../components/Formularios/equipos.jsx", () => ({ default: () => null }));
vi.mock("../components/Formularios/clases.jsx", () => ({ default: () => null }));
vi.mock("../components/Formularios/pases.jsx", () => ({ default: () => null }));
vi.mock("../components/Formularios/transporte.jsx", () => ({ default: () => null }));
vi.mock("../components/Formularios/hoteles.jsx", () => ({ default: () => null }));

import { handleEquipos, handleClases, handlePases, handleTransporte } from "../lib/utils/secciones.jsx";

// ---------------------------------------------------------------------------
// Fixtures — misma forma que devuelven los mappers de spreadsheet.js
// ---------------------------------------------------------------------------

// Fecha "01/07/2025 al 31/08/2025" como rango de temporada
const temporadaInicio = "01/07/2025";
const temporadaFin = "31/08/2025";

const makeRental = (cerro, dias, precio, gama = "") => ({
  cerro,
  gama,
  articulo: "Skis",
  fechaInicio: temporadaInicio,
  fechaFinal: temporadaFin,
  dias,
  precio,
});

const makePase = (cerro, dias, precio, tipo = "", edad = "Adulto") => ({
  cerro,
  tipo,
  edad,
  fechaInicio: temporadaInicio,
  fechaFinal: temporadaFin,
  dias,
  precio,
});

const makeTraslado = (cerro, servicio, tramo, precio, personas = 1) => ({
  cerro,
  servicio,
  tramo,
  descripcion: "Transfer regular",
  fechaInicio: temporadaInicio,
  fechaFinal: temporadaFin,
  precio,
  personas,
});

const makeClase = (cerro, dias, precio, tipo = "") => ({
  cerro,
  tipo,
  fechaInicio: temporadaInicio,
  fechaFinal: temporadaFin,
  dias,
  precio,
});

const startDate = new Date(2025, 6, 15); // 15 jul 2025

// ---------------------------------------------------------------------------
// handleEquipos
// ---------------------------------------------------------------------------
describe("handleEquipos", () => {
  const rentals = [
    makeRental("Catedral", 1, 5000),
    makeRental("Catedral", 2, 9000),
    makeRental("Catedral", 3, 12000),
    makeRental("Chapelco", 1, 4000),
    makeRental("Chapelco", 1, 4500, "Alto"),
  ];

  it("filtra por cerro", () => {
    const setter = vi.fn();
    handleEquipos("Catedral", rentals, setter, startDate, 1, null);
    const result = setter.mock.calls[0][0];
    expect(result.every((r) => r.cerro === "Catedral")).toBe(true);
  });

  it("filtra por días (1 día acepta dias<=1)", () => {
    const setter = vi.fn();
    handleEquipos("Catedral", rentals, setter, startDate, 1, null);
    const result = setter.mock.calls[0][0];
    expect(result.every((r) => Number(r.dias) <= 1)).toBe(true);
  });

  it("filtra por días exactos para días > 1", () => {
    const setter = vi.fn();
    handleEquipos("Catedral", rentals, setter, startDate, 2, null);
    const result = setter.mock.calls[0][0];
    expect(result.every((r) => Number(r.dias) === 2)).toBe(true);
  });

  it("filtra por gama cuando se especifica", () => {
    const setter = vi.fn();
    handleEquipos("Chapelco", rentals, setter, startDate, 1, "Alto");
    const result = setter.mock.calls[0][0];
    // Chapelco usa calcularTotalPorDia → devuelve [{ precio, paquete }]
    expect(result.every((r) => r.paquete?.gama === "Alto")).toBe(true);
  });

  it("comparación de cerro es case-insensitive", () => {
    const setter = vi.fn();
    // "catedral" (minúsculas) debería matchear "Catedral"
    const rentalsConCasing = [makeRental("catedral", 1, 5000)];
    handleEquipos("Catedral", rentalsConCasing, setter, startDate, 1, null);
    const result = setter.mock.calls[0][0];
    expect(result.length).toBeGreaterThan(0);
  });

  it("devuelve array vacío si no hay matches", () => {
    const setter = vi.fn();
    handleEquipos("LasLeñas", rentals, setter, startDate, 1, null);
    const result = setter.mock.calls[0][0];
    expect(result).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// handlePases — Catedral (multiplica precio diario × días)
// ---------------------------------------------------------------------------
describe("handlePases - Catedral", () => {
  const pases = [
    makePase("Catedral", 1, 5000, "", "Adulto"),
    makePase("Catedral", 1, 3000, "", "Menor"),
    makePase("Chapelco", 3, 10000),
  ];

  it("multiplica precio × días para Catedral", () => {
    const setter = vi.fn();
    handlePases("Catedral", pases, setter, startDate, 3, null);
    const result = setter.mock.calls[0][0];
    // Solo Catedral, precio unitario × 3 días
    expect(result.some((p) => p.precio === 5000 * 3)).toBe(true);
    expect(result.some((p) => p.precio === 3000 * 3)).toBe(true);
  });

  it("el campo dias del resultado refleja los días solicitados", () => {
    const setter = vi.fn();
    handlePases("Catedral", pases, setter, startDate, 5, null);
    const result = setter.mock.calls[0][0];
    expect(result.every((p) => p.dias === 5)).toBe(true);
  });

  it("no mezcla pases de otros cerros", () => {
    const setter = vi.fn();
    handlePases("Catedral", pases, setter, startDate, 1, null);
    const result = setter.mock.calls[0][0];
    expect(result.every((p) => p.cerro === "Catedral")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// handlePases — Las Leñas (filterByStartDate, matchesDias)
// ---------------------------------------------------------------------------
describe("handlePases - Las Leñas", () => {
  const pases = [
    makePase("Las Leñas", 3, 15000),
    makePase("Las Leñas", 5, 22000),
    makePase("Catedral", 3, 10000),
  ];

  it("filtra por días exactos", () => {
    const setter = vi.fn();
    handlePases("Las Leñas", pases, setter, startDate, 3, null);
    const result = setter.mock.calls[0][0];
    expect(result.every((p) => Number(p.dias) === 3)).toBe(true);
  });

  it("ordena por precio ascendente", () => {
    const pasesMix = [
      makePase("Las Leñas", 3, 20000),
      makePase("Las Leñas", 3, 10000),
    ];
    const setter = vi.fn();
    handlePases("Las Leñas", pasesMix, setter, startDate, 3, null);
    const result = setter.mock.calls[0][0];
    expect(result[0].precio).toBeLessThanOrEqual(result[1]?.precio ?? Infinity);
  });
});

// ---------------------------------------------------------------------------
// handleClases
// ---------------------------------------------------------------------------
describe("handleClases", () => {
  const clases = [
    makeClase("Catedral", 1, 8000),
    makeClase("Catedral", 2, 14000),
    makeClase("Chapelco", 1, 7000),
  ];

  it("filtra por cerro y días", () => {
    const setter = vi.fn();
    handleClases("Catedral", clases, setter, startDate, 2, null);
    const result = setter.mock.calls[0][0];
    expect(result.every((c) => c.cerro === "Catedral" && Number(c.dias) === 2)).toBe(true);
  });

  it("filtra por tipo cuando se especifica", () => {
    const clasesConTipo = [
      makeClase("Catedral", 1, 8000, "Adulto"),
      makeClase("Catedral", 1, 5000, "Menor"),
    ];
    const setter = vi.fn();
    handleClases("Catedral", clasesConTipo, setter, startDate, 1, "Adulto");
    const result = setter.mock.calls[0][0];
    expect(result.every((c) => c.tipo === "Adulto")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// handleTransporte
// ---------------------------------------------------------------------------
describe("handleTransporte", () => {
  const traslados = [
    makeTraslado("Catedral", "Pasaje", "Ida", 3000),
    makeTraslado("Catedral", "Pasaje", "Vuelta", 3000),
    makeTraslado("Catedral", "Transfer", "Ida", 8000, 1),
    makeTraslado("Catedral", "Transfer", "Vuelta", 8000, 1),
    makeTraslado("Catedral", "Transfer", "Ida y Vuelta", 12000, 1),
    makeTraslado("Chapelco", "Pasaje", "Ida", 5000),
  ];

  const endDate = new Date(2025, 6, 22);

  it("filtra Pasaje correctamente", () => {
    const setter = vi.fn();
    handleTransporte("Catedral", traslados, setter, startDate, endDate, "Pasaje", "Regular", null);
    const result = setter.mock.calls[0][0];
    expect(result.every((t) => t.servicio === "Pasaje")).toBe(true);
  });

  it("filtra por cerro de forma case-insensitive", () => {
    const trasladosCasing = [makeTraslado("catedral", "Pasaje", "Ida", 3000)];
    const setter = vi.fn();
    handleTransporte("Catedral", trasladosCasing, setter, startDate, endDate, "Pasaje", "Regular", null);
    const result = setter.mock.calls[0][0];
    expect(result.length).toBeGreaterThan(0);
  });

  it("Transfer con ida y vuelta devuelve objeto {ida, vuelta, idayvuelta}", () => {
    const setter = vi.fn();
    handleTransporte("Catedral", traslados, setter, startDate, endDate, "Transfer", "Regular", null);
    const result = setter.mock.calls[0][0];
    expect(result).toHaveProperty("ida");
    expect(result).toHaveProperty("vuelta");
    expect(result).toHaveProperty("idayvuelta");
  });

  it("agrega inicio y fin al paquete", () => {
    const setter = vi.fn();
    handleTransporte("Catedral", traslados, setter, startDate, endDate, "Pasaje", "Regular", null);
    const result = setter.mock.calls[0][0];
    expect(result[0]).toHaveProperty("inicio");
    expect(result[0]).toHaveProperty("fin");
  });

  it("no mezcla otros cerros", () => {
    const setter = vi.fn();
    handleTransporte("Catedral", traslados, setter, startDate, endDate, "Pasaje", "Regular", null);
    const result = setter.mock.calls[0][0];
    expect(result.every((t) => t.cerro.toLowerCase() === "catedral")).toBe(true);
  });
});

// =============================================================================
// ESCENARIOS CONCRETOS
// Dado un conjunto de paquetes realistas, verificar precio y estructura exactos.
// =============================================================================

// ---------------------------------------------------------------------------
// Escenario 1: Catedral pases — precio diario × días solicitados
// ---------------------------------------------------------------------------
describe("Escenario: Catedral pases — multiplicación precio × días", () => {
  // Catedral solo tiene filas con dias=1 (precio diario).
  // handlePases debe devolver precio = precio_diario × dias_solicitados.
  const pases = [
    { cerro: "Catedral", tipo: "", edad: "Adulto", dias: 1, precio: 5000, fechaInicio: "01/07/2025", fechaFinal: "31/08/2025" },
    { cerro: "Catedral", tipo: "", edad: "Menor",  dias: 1, precio: 3000, fechaInicio: "01/07/2025", fechaFinal: "31/08/2025" },
    { cerro: "Catedral", tipo: "", edad: "Senior", dias: 1, precio: 4000, fechaInicio: "01/07/2025", fechaFinal: "31/08/2025" },
  ];
  const start = new Date(2025, 6, 15); // 15 jul — dentro del rango

  it("3 días: cada pase tiene precio = diario × 3", () => {
    const setter = vi.fn();
    handlePases("Catedral", pases, setter, start, 3, null);
    const result = setter.mock.calls[0][0];

    const adulto = result.find((p) => p.edad === "Adulto");
    const menor  = result.find((p) => p.edad === "Menor");
    const senior = result.find((p) => p.edad === "Senior");

    expect(adulto.precio).toBe(5000 * 3);  // 15.000
    expect(menor.precio).toBe(3000 * 3);   // 9.000
    expect(senior.precio).toBe(4000 * 3);  // 12.000
  });

  it("7 días: precio escala linealmente", () => {
    const setter = vi.fn();
    handlePases("Catedral", pases, setter, start, 7, null);
    const result = setter.mock.calls[0][0];
    expect(result.find((p) => p.edad === "Adulto").precio).toBe(5000 * 7);
  });

  it("el campo dias del resultado es igual a los días solicitados", () => {
    const setter = vi.fn();
    handlePases("Catedral", pases, setter, start, 5, null);
    const result = setter.mock.calls[0][0];
    expect(result.every((p) => p.dias === 5)).toBe(true);
  });

  it("no incluye pases fuera del rango de fechas", () => {
    const start_fuera = new Date(2025, 9, 5); // 5 oct — fuera de temporada
    const setter = vi.fn();
    handlePases("Catedral", pases, setter, start_fuera, 1, null);
    const result = setter.mock.calls[0][0];
    expect(result).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Escenario 2: Castor pases — calcularTotalPorDia con dos rangos de precio
// ---------------------------------------------------------------------------
describe("Escenario: Castor pases — precio ponderado por día entre dos períodos", () => {
  // Precio temporada baja (jul 1-15): 7000 el pase de 7 días (= 1000/día)
  // Precio temporada alta (jul 16-31): 14000 el pase de 7 días (= 2000/día)
  // Si busco 7 días desde jul 10: 6 días en temp. baja + 1 día en temp. alta
  // calcularTotalPorDia: sum(precio_rango / dias_solicitados) por cada día
  //   = 6 × (7000/7) + 1 × (14000/7) = 6000 + 2000 = 8000
  const pases = [
    { cerro: "Castor", tipo: "", edad: "Adulto", dias: 7, precio: 7000,  fechaInicio: "01/07/2025", fechaFinal: "15/07/2025" },
    { cerro: "Castor", tipo: "", edad: "Adulto", dias: 7, precio: 14000, fechaInicio: "16/07/2025", fechaFinal: "31/07/2025" },
  ];
  const start = new Date(2025, 6, 10); // 10 jul

  it("precio total = suma ponderada de cada día según su rango", () => {
    const setter = vi.fn();
    handlePases("Castor", pases, setter, start, 7, null);
    const result = setter.mock.calls[0][0];

    // El resultado para Adulto: 6 días × 1000 + 1 día × 2000 = 8000
    const adulto = result.find((r) => r.paquete?.edad === "Adulto");
    expect(adulto.precio).toBeCloseTo(8000, 0);
  });

  it("devuelve un resultado por grupo de edad", () => {
    const pasesDosEdades = [
      ...pases,
      { cerro: "Castor", tipo: "", edad: "Menor", dias: 7, precio: 4000,  fechaInicio: "01/07/2025", fechaFinal: "15/07/2025" },
      { cerro: "Castor", tipo: "", edad: "Menor", dias: 7, precio: 7000,  fechaInicio: "16/07/2025", fechaFinal: "31/07/2025" },
    ];
    const setter = vi.fn();
    handlePases("Castor", pasesDosEdades, setter, start, 7, null);
    const result = setter.mock.calls[0][0];
    expect(result).toHaveLength(2); // Adulto + Menor
  });
});

// ---------------------------------------------------------------------------
// Escenario 3: Transporte — estructura exacta del resultado
// ---------------------------------------------------------------------------
describe("Escenario: Transporte Transfer — agrupación ida/vuelta/idayvuelta", () => {
  const traslados = [
    { cerro: "Catedral", servicio: "Transfer", tramo: "Ida",          descripcion: "Transfer regular", precio: 8000,  personas: 1, fechaInicio: "01/07/2025", fechaFinal: "31/08/2025" },
    { cerro: "Catedral", servicio: "Transfer", tramo: "Vuelta",       descripcion: "Transfer regular", precio: 8000,  personas: 1, fechaInicio: "01/07/2025", fechaFinal: "31/08/2025" },
    { cerro: "Catedral", servicio: "Transfer", tramo: "Ida y Vuelta", descripcion: "Transfer regular", precio: 14000, personas: 1, fechaInicio: "01/07/2025", fechaFinal: "31/08/2025" },
  ];
  const start  = new Date(2025, 6, 15);
  const end    = new Date(2025, 6, 22);

  it("devuelve objeto con claves ida, vuelta, idayvuelta", () => {
    const setter = vi.fn();
    handleTransporte("Catedral", traslados, setter, start, end, "Transfer", "Regular", null);
    const result = setter.mock.calls[0][0];
    expect(result).toHaveProperty("ida");
    expect(result).toHaveProperty("vuelta");
    expect(result).toHaveProperty("idayvuelta");
  });

  it("ida contiene solo tramo Ida con precio correcto", () => {
    const setter = vi.fn();
    handleTransporte("Catedral", traslados, setter, start, end, "Transfer", "Regular", null);
    const { ida } = setter.mock.calls[0][0];
    expect(ida).toHaveLength(1);
    expect(ida[0].precio).toBe(8000);
  });

  it("idayvuelta contiene el traslado combinado", () => {
    const setter = vi.fn();
    handleTransporte("Catedral", traslados, setter, start, end, "Transfer", "Regular", null);
    const { idayvuelta } = setter.mock.calls[0][0];
    expect(idayvuelta).toHaveLength(1);
    expect(idayvuelta[0].precio).toBe(14000);
  });

  it("sin tramo Vuelta → devuelve array plano (no objeto)", () => {
    const soloIda = [
      { cerro: "Catedral", servicio: "Transfer", tramo: "Ida", descripcion: "Transfer", precio: 8000, personas: 1, fechaInicio: "01/07/2025", fechaFinal: "31/08/2025" },
    ];
    const setter = vi.fn();
    handleTransporte("Catedral", soloIda, setter, start, end, "Transfer", "Regular", null);
    const result = setter.mock.calls[0][0];
    expect(Array.isArray(result)).toBe(true);
  });

  it("agrega fechas inicio y fin al resultado", () => {
    const setter = vi.fn();
    handleTransporte("Catedral", traslados, setter, start, end, "Transfer", "Regular", null);
    const { ida } = setter.mock.calls[0][0];
    expect(ida[0].inicio).toBe("15/7/2025");
    expect(ida[0].fin).toBe("22/7/2025");
  });
});

// ---------------------------------------------------------------------------
// Escenario 4: Equipos Las Leñas — orden por precio
// ---------------------------------------------------------------------------
describe("Escenario: Equipos Las Leñas — resultado ordenado por precio", () => {
  const rentals = [
    { cerro: "Las Leñas", gama: "", articulo: "Skis Alto",  dias: 3, precio: 15000, fechaInicio: "01/07/2025", fechaFinal: "31/08/2025" },
    { cerro: "Las Leñas", gama: "", articulo: "Skis Bajo",  dias: 3, precio: 8000,  fechaInicio: "01/07/2025", fechaFinal: "31/08/2025" },
    { cerro: "Las Leñas", gama: "", articulo: "Skis Medio", dias: 3, precio: 11000, fechaInicio: "01/07/2025", fechaFinal: "31/08/2025" },
  ];
  const start = new Date(2025, 6, 15);

  it("devuelve los 3 paquetes exactos del cerro", () => {
    const setter = vi.fn();
    handleEquipos("Las Leñas", rentals, setter, start, 3, null);
    const result = setter.mock.calls[0][0];
    expect(result).toHaveLength(3);
  });

  it("resultado ordenado de menor a mayor precio", () => {
    const setter = vi.fn();
    handleEquipos("Las Leñas", rentals, setter, start, 3, null);
    const result = setter.mock.calls[0][0];
    const precios = result.map((r) => r.precio);
    expect(precios).toEqual([8000, 11000, 15000]);
  });

  it("excluye equipos con días distintos a los solicitados", () => {
    const rentalsConMix = [
      ...rentals,
      { cerro: "Las Leñas", gama: "", articulo: "Skis 5d", dias: 5, precio: 20000, fechaInicio: "01/07/2025", fechaFinal: "31/08/2025" },
    ];
    const setter = vi.fn();
    handleEquipos("Las Leñas", rentalsConMix, setter, start, 3, null);
    const result = setter.mock.calls[0][0];
    expect(result.every((r) => Number(r.dias) === 3)).toBe(true);
    expect(result).toHaveLength(3);
  });
});
