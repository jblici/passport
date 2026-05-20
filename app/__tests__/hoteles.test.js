import { describe, it, expect, vi } from "vitest";
import {
  parseDate,
  normalizeDate,
  calcularDiferenciaDias,
  calcularDiferenciaDiasProducto,
  calcularTotalPersonas,
  handleHoteles,
} from "../lib/utils/hoteles";

// ---------------------------------------------------------------------------
// parseDate
// ---------------------------------------------------------------------------
describe("parseDate", () => {
  it("parsea DD/MM/YYYY a Date local midnight", () => {
    const date = parseDate("15/07/2025");
    expect(date.getFullYear()).toBe(2025);
    expect(date.getMonth()).toBe(6); // julio = índice 6
    expect(date.getDate()).toBe(15);
    expect(date.getHours()).toBe(0); // medianoche local
  });

  it("parsea correctamente el primer día del mes", () => {
    const date = parseDate("01/06/2025");
    expect(date.getDate()).toBe(1);
    expect(date.getMonth()).toBe(5); // junio
  });

  it("parsea correctamente el último día del año", () => {
    const date = parseDate("31/12/2025");
    expect(date.getDate()).toBe(31);
    expect(date.getMonth()).toBe(11); // diciembre
  });
});

// ---------------------------------------------------------------------------
// normalizeDate
// ---------------------------------------------------------------------------
describe("normalizeDate", () => {
  it("normaliza a medianoche local", () => {
    const date = new Date(2025, 6, 15, 14, 30, 0); // 14:30
    const normalized = normalizeDate(date);
    expect(normalized.getHours()).toBe(0);
    expect(normalized.getMinutes()).toBe(0);
    expect(normalized.getDate()).toBe(15);
  });

  it("devuelve null si la entrada es null", () => {
    expect(normalizeDate(null)).toBeNull();
  });

  it("es consistente con parseDate para la misma fecha", () => {
    const fromString = parseDate("15/07/2025");
    const fromDate = normalizeDate(new Date(2025, 6, 15, 20, 0, 0));
    expect(fromString.getTime()).toBe(fromDate.getTime());
  });
});

// ---------------------------------------------------------------------------
// calcularDiferenciaDias
// ---------------------------------------------------------------------------
describe("calcularDiferenciaDias", () => {
  it("calcula noches entre dos fechas", () => {
    const inicio = new Date(2025, 6, 1);
    const fin = new Date(2025, 6, 8);
    expect(calcularDiferenciaDias(inicio, fin)).toBe(7);
  });

  it("1 noche entre fechas consecutivas", () => {
    const inicio = new Date(2025, 6, 10);
    const fin = new Date(2025, 6, 11);
    expect(calcularDiferenciaDias(inicio, fin)).toBe(1);
  });

  it("cruza mes correctamente", () => {
    const inicio = new Date(2025, 6, 28); // 28 jul
    const fin = new Date(2025, 7, 4);    // 4 ago
    expect(calcularDiferenciaDias(inicio, fin)).toBe(7);
  });
});

// ---------------------------------------------------------------------------
// calcularDiferenciaDiasProducto
// ---------------------------------------------------------------------------
describe("calcularDiferenciaDiasProducto", () => {
  it("MiniWeek = 2 noches", () => {
    expect(calcularDiferenciaDiasProducto("MiniWeek")).toBe(2);
  });

  it("ExtraWeek = 5 noches", () => {
    expect(calcularDiferenciaDiasProducto("ExtraWeek")).toBe(5);
  });

  it("SkiWeek = 7 noches", () => {
    expect(calcularDiferenciaDiasProducto("SkiWeek")).toBe(7);
  });

  it("producto desconocido devuelve 0", () => {
    expect(calcularDiferenciaDiasProducto("DesconocidoWeek")).toBe(0);
    expect(calcularDiferenciaDiasProducto(null)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// calcularTotalPersonas
// ---------------------------------------------------------------------------
describe("calcularTotalPersonas", () => {
  it("una habitación: suma mayores y menores", () => {
    const detalle = [{ mayores: "2", menores: "1" }];
    const result = calcularTotalPersonas(detalle);
    expect(result.total).toBe(3);
    expect(result.habitaciones).toHaveLength(1);
    expect(result.habitaciones[0]).toEqual({ total: 3, mayores: 2, menores: 1 });
  });

  it("dos habitaciones: agrega entrada combinada al final", () => {
    const detalle = [
      { mayores: "2", menores: "0" },
      { mayores: "1", menores: "1" },
    ];
    const result = calcularTotalPersonas(detalle);
    expect(result.total).toBe(4);
    // Con múltiples habitaciones agrega la entrada combinada
    expect(result.habitaciones).toHaveLength(3);
    const combinada = result.habitaciones[2];
    expect(combinada.total).toBe(4);
    expect(combinada.mayores).toBe(3);
    expect(combinada.menores).toBe(1);
  });

  it("habitación sin personas devuelve total 0", () => {
    const detalle = [{ mayores: "0", menores: "0" }];
    const result = calcularTotalPersonas(detalle);
    expect(result.total).toBe(0);
  });

  it("strings no numéricos se tratan como 0", () => {
    const detalle = [{ mayores: "", menores: "abc" }];
    const result = calcularTotalPersonas(detalle);
    expect(result.total).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// handleHoteles — escenarios
// ---------------------------------------------------------------------------

// Helper: detalle de habitaciones con 1 habitación de mayores/menores
const hab = (mayores, menores = 0) => [{ mayores: String(mayores), menores: String(menores) }];

// Paquete base Las Leñas (SkiWeek)
const pkgLasLenas = (overrides = {}) => ({
  cerro: "Las Leñas",
  hotel: "El Refugio",
  week: "SkiWeek",
  personas: 2,
  precio: 10000,
  precioMenor: 0,
  minNoches: 7,
  fechaInicio: "01/07/2025",
  fechaFinal: "31/08/2025",
  camaExtra: "No",
  id: 1,
  moneda: "ARS",
  ...overrides,
});

// Paquete base Castor/Catedral (noches × precio)
const pkgCerro = (cerro, overrides = {}) => ({
  cerro,
  hotel: "Refugio",
  habitacion: "Doble",
  personas: 2,
  precio: 5000,
  precioMenor: null,
  tarifa: "",
  minNoches: 1,
  fechaInicio: "01/07/2025",
  fechaFinal: "31/08/2025",
  camaExtra: "No",
  id: 1,
  moneda: "ARS",
  ...overrides,
});

describe("Escenario: Las Leñas SkiWeek", () => {
  // startDate = 5 Jul 2025 (sábado)
  const startDate = new Date(2025, 6, 5); // local midnight
  const producto = "SkiWeek"; // 7 noches → fechaFin = 12 Jul

  it("produce un resultado por habitación con precio = calcularPrecioHabitacion (sin multiplicar noches)", () => {
    const setter = vi.fn();
    handleHoteles(startDate, null, [], producto, "Las Leñas", [pkgLasLenas()], setter, hab(2));

    expect(setter).toHaveBeenCalledOnce();
    const resultado = setter.mock.calls[0][0];
    expect(resultado).toHaveProperty("Habitacion 1");
    const items = resultado["Habitacion 1"];
    expect(items).toHaveLength(1);
    // 2 adultos × 10000 = 20000 (sin multiplicar noches — el paquete ya cubre la semana)
    expect(items[0].precioTotal).toBe(20000);
  });

  it("noches refleja el producto seleccionado", () => {
    const setter = vi.fn();
    handleHoteles(startDate, null, [], producto, "Las Leñas", [pkgLasLenas()], setter, hab(2));
    const items = setter.mock.calls[0][0]["Habitacion 1"];
    expect(items[0].noches).toBe(7);
  });

  it("fechaInicio y fechaFinal del resultado usan stringDate con padding", () => {
    const setter = vi.fn();
    handleHoteles(startDate, null, [], producto, "Las Leñas", [pkgLasLenas()], setter, hab(2));
    const item = setter.mock.calls[0][0]["Habitacion 1"][0];
    expect(item.fechaInicio).toBe("05/07/2025");
    expect(item.fechaFinal).toBe("12/07/2025"); // 5 Jul + 7 noches
  });

  it("filtra por hotel cuando hotelSeleccionado no está vacío", () => {
    const setter = vi.fn();
    const paquetes = [pkgLasLenas({ hotel: "El Refugio" }), pkgLasLenas({ hotel: "Otro", id: 2 })];
    handleHoteles(startDate, null, ["El Refugio"], producto, "Las Leñas", paquetes, setter, hab(2));
    const items = setter.mock.calls[0][0]["Habitacion 1"];
    expect(items.every((i) => i.paquetesUtilizados.hotel === "El Refugio")).toBe(true);
  });

  it("descarta paquetes fuera del rango de fechas", () => {
    const setter = vi.fn();
    // paquete vigente solo en agosto → Jul 5 no cae dentro
    const paqueteAgosto = pkgLasLenas({ fechaInicio: "01/08/2025", fechaFinal: "31/08/2025" });
    handleHoteles(startDate, null, [], producto, "Las Leñas", [paqueteAgosto], setter, hab(2));
    // No hay resultados → calcularHoteles lanza → handleHoteles atrapa → setter no se llama
    expect(setter).not.toHaveBeenCalled();
  });
});

describe("Escenario: Castor — período único, noches × precio", () => {
  const startDate = new Date(2025, 6, 1); // 1 Jul
  const endDate = new Date(2025, 6, 5);   // 5 Jul → 4 noches

  it("calcula precioTotal = noches × calcularPrecioHabitacion", () => {
    const setter = vi.fn();
    handleHoteles(startDate, endDate, [], null, "Castor", [pkgCerro("Castor")], setter, hab(2));

    const items = setter.mock.calls[0][0]["Habitacion 1"];
    // 4 noches × (5000 × 2 adultos) = 40000
    expect(items[0].precioTotal).toBe(40000);
    expect(items[0].noches).toBe(4);
    expect(items[0].precioPromedio).toBe(10000);
  });

  it("descarta paquetes donde minNoches > cantidadNoches", () => {
    const setter = vi.fn();
    const paquete = pkgCerro("Castor", { minNoches: 7 }); // exige 7 noches mínimo, buscamos 4
    handleHoteles(startDate, endDate, [], null, "Castor", [paquete], setter, hab(2));
    // El setter se llama pero con resultado vacío para esa habitación
    expect(setter).toHaveBeenCalledOnce();
    expect(setter.mock.calls[0][0]["Habitacion 1"]).toHaveLength(0);
  });

  it("incluye mayores y menores en el objeto de resultado", () => {
    const setter = vi.fn();
    // Paquete para 3 personas: 2 adultos + 1 menor con precioMenor
    const paquete = pkgCerro("Castor", {
      personas: 3,
      precioMenor: 2000,
    });
    handleHoteles(startDate, endDate, [], null, "Castor", [paquete], setter, hab(2, 1));
    const item = setter.mock.calls[0][0]["Habitacion 1"][0];
    expect(item.mayores).toBe(2);
    expect(item.menores).toBe(1);
    // 4 noches × (5000×2 + 2000×1) = 4 × 12000 = 48000
    expect(item.precioTotal).toBe(48000);
  });
});

describe("Escenario: Catedral — combinación multi-período", () => {
  // Búsqueda: 8-12 Jul (4 noches)
  // Período 1 cubre Jul 1-9, período 2 cubre Jul 10-31
  const startDate = new Date(2025, 6, 8);  // 8 Jul
  const endDate   = new Date(2025, 6, 12); // 12 Jul

  const pkg1 = pkgCerro("Catedral", {
    hotel: "Villa",
    precio: 3000,
    fechaInicio: "01/07/2025",
    fechaFinal: "09/07/2025",
    id: 1,
  });
  const pkg2 = pkgCerro("Catedral", {
    hotel: "Villa",
    precio: 5000,
    fechaInicio: "10/07/2025",
    fechaFinal: "31/07/2025",
    id: 2,
  });

  it("combina dos períodos y devuelve un único resultado", () => {
    const setter = vi.fn();
    handleHoteles(startDate, endDate, [], null, "Catedral", [pkg1, pkg2], setter, hab(2));
    const items = setter.mock.calls[0][0]["Habitacion 1"];
    expect(items).toHaveLength(1);
  });

  it("calcula noches totales correctas (4) y precio ponderado por período", () => {
    const setter = vi.fn();
    handleHoteles(startDate, endDate, [], null, "Catedral", [pkg1, pkg2], setter, hab(2));
    const item = setter.mock.calls[0][0]["Habitacion 1"][0];
    // 2 noches × (3000×2) + 2 noches × (5000×2) = 12000 + 20000 = 32000
    expect(item.noches).toBe(4);
    expect(item.precioTotal).toBe(32000);
    expect(item.precioPromedio).toBe(8000);
  });

  it("paquetesUtilizados es un objeto {paquetes:[...]} cuando hay combinación", () => {
    const setter = vi.fn();
    handleHoteles(startDate, endDate, [], null, "Catedral", [pkg1, pkg2], setter, hab(2));
    const { paquetesUtilizados } = setter.mock.calls[0][0]["Habitacion 1"][0];
    expect(paquetesUtilizados).toHaveProperty("paquetes");
    expect(paquetesUtilizados.paquetes).toHaveLength(2);
  });

  it("un único período que cubre todo devuelve paquetesUtilizados como objeto plano", () => {
    const setter = vi.fn();
    // Solo pkg2 que empieza en jul 10 — no cubre desde jul 8, no habrá resultado
    // Usamos un paquete que sí cubre todo el rango
    const pkgFull = pkgCerro("Catedral", {
      hotel: "Villa",
      precio: 4000,
      fechaInicio: "01/07/2025",
      fechaFinal: "31/07/2025",
      id: 3,
    });
    handleHoteles(startDate, endDate, [], null, "Catedral", [pkgFull], setter, hab(2));
    const { paquetesUtilizados } = setter.mock.calls[0][0]["Habitacion 1"][0];
    // Período único → paquetesUtilizados es el objeto directo (no {paquetes:[...]})
    expect(paquetesUtilizados).not.toHaveProperty("paquetes");
    expect(paquetesUtilizados.id).toBe(3);
  });
});

describe("Escenario: Sin cobertura de fechas — resultado vacío", () => {
  it("cuando ningún paquete cubre las fechas, el setter recibe Habitacion 1 vacía", () => {
    const startDate = new Date(2025, 6, 1);
    const endDate   = new Date(2025, 6, 5);
    const setter = vi.fn();
    // Paquete solo disponible en agosto → la combinación nunca cubre julio
    const paqueteAgosto = pkgCerro("Castor", {
      fechaInicio: "01/08/2025",
      fechaFinal: "31/08/2025",
    });
    handleHoteles(startDate, endDate, [], null, "Castor", [paqueteAgosto], setter, hab(2));
    expect(setter).toHaveBeenCalledOnce();
    expect(setter.mock.calls[0][0]["Habitacion 1"]).toHaveLength(0);
  });

  it("cuando el array de paquetes está vacío, el setter recibe Habitacion 1 vacía", () => {
    const setter = vi.fn();
    handleHoteles(new Date(2025, 6, 1), new Date(2025, 6, 5), [], null, "Castor", [], setter, hab(2));
    expect(setter).toHaveBeenCalledOnce();
    expect(setter.mock.calls[0][0]["Habitacion 1"]).toHaveLength(0);
  });
});
