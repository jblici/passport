import { describe, it, expect } from "vitest";
import {
  formatNumberWithDots,
  formatNumberPercentage,
  formatDate,
  stringDate,
  sumarDias,
  checkFamilyPlanEligibility,
  applyFamilyPlanDiscount,
} from "../lib/utils/extras";

// ---------------------------------------------------------------------------
// formatNumberWithDots
// ---------------------------------------------------------------------------
describe("formatNumberWithDots", () => {
  it("formatea miles con puntos", () => {
    expect(formatNumberWithDots(1000)).toBe("1.000");
    expect(formatNumberWithDots(1000000)).toBe("1.000.000");
    expect(formatNumberWithDots(123456)).toBe("123.456");
  });

  it("redondea al entero más cercano", () => {
    expect(formatNumberWithDots(1000.7)).toBe("1.001");
    expect(formatNumberWithDots(1000.2)).toBe("1.000");
  });

  it("maneja números menores a 1000", () => {
    expect(formatNumberWithDots(0)).toBe("0");
    expect(formatNumberWithDots(999)).toBe("999");
  });

  it("acepta strings numéricos", () => {
    expect(formatNumberWithDots("50000")).toBe("50.000");
  });
});

// ---------------------------------------------------------------------------
// formatNumberPercentage
// ---------------------------------------------------------------------------
describe("formatNumberPercentage", () => {
  it("calcula porcentaje correctamente", () => {
    expect(formatNumberPercentage(200, 1000)).toBe(20);
    expect(formatNumberPercentage(100, 400)).toBe(25);
  });

  it("devuelve 0 si algún argumento es falsy", () => {
    expect(formatNumberPercentage(0, 1000)).toBe(0);
    expect(formatNumberPercentage(null, 1000)).toBe(0);
    expect(formatNumberPercentage(100, 0)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// sumarDias
// ---------------------------------------------------------------------------
describe("sumarDias", () => {
  it("suma días correctamente", () => {
    const base = new Date(2025, 6, 1); // 1 jul 2025
    const resultado = sumarDias(base, 7);
    expect(resultado.getDate()).toBe(8);
    expect(resultado.getMonth()).toBe(6);
  });

  it("cruza correctamente fin de mes", () => {
    const base = new Date(2025, 6, 28); // 28 jul
    const resultado = sumarDias(base, 5);
    expect(resultado.getDate()).toBe(2);
    expect(resultado.getMonth()).toBe(7); // agosto
  });

  it("no muta la fecha original", () => {
    const base = new Date(2025, 6, 1);
    sumarDias(base, 10);
    expect(base.getDate()).toBe(1);
  });

  it("suma 0 días devuelve la misma fecha", () => {
    const base = new Date(2025, 6, 15);
    const resultado = sumarDias(base, 0);
    expect(resultado.getDate()).toBe(15);
  });
});

// ---------------------------------------------------------------------------
// stringDate
// ---------------------------------------------------------------------------
describe("stringDate", () => {
  it("formatea fecha en DD/MM/YYYY", () => {
    const fecha = new Date(2025, 6, 5); // 5 jul 2025 local
    expect(stringDate(fecha)).toBe("05/07/2025");
  });

  it("padea días y meses de un dígito", () => {
    const fecha = new Date(2025, 0, 3); // 3 ene
    expect(stringDate(fecha)).toBe("03/01/2025");
  });

  it("devuelve 'Fecha inválida' para una fecha inválida", () => {
    expect(stringDate("no-es-fecha")).toBe("Fecha inválida");
  });
});

// ---------------------------------------------------------------------------
// formatDate
// ---------------------------------------------------------------------------
describe("formatDate", () => {
  it("devuelve fechaInicial y fechaFinal correctas", () => {
    const fecha = new Date(2025, 6, 1);
    const { fechaInicial, fechaFinal } = formatDate(fecha, 7);
    expect(fechaInicial).toBe("01/07/2025");
    expect(fechaFinal).toBe("08/07/2025");
  });

  it("no muta la fecha original", () => {
    const fecha = new Date(2025, 6, 1);
    formatDate(fecha, 7);
    expect(fecha.getDate()).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// checkFamilyPlanEligibility
// ---------------------------------------------------------------------------
describe("checkFamilyPlanEligibility", () => {
  const makePackage = (seccion, count, noches) => ({
    seccion,
    count,
    noches,
    price: 1000,
    promo: false,
  });

  it("es elegible con 4 personas en pases con 8+ noches", () => {
    const packages = [makePackage("pases", 4, 8)];
    expect(checkFamilyPlanEligibility(packages)).toBe(true);
  });

  it("no es elegible con menos de 4 personas", () => {
    const packages = [makePackage("pases", 3, 8)];
    expect(checkFamilyPlanEligibility(packages)).toBe(false);
  });

  it("no es elegible con 4 personas pero menos de 8 noches en pases", () => {
    const packages = [makePackage("pases", 4, 7)];
    expect(checkFamilyPlanEligibility(packages)).toBe(false);
  });

  it("clases requiere 6+ noches (umbral distinto)", () => {
    const packages = [makePackage("clases", 4, 6)];
    expect(checkFamilyPlanEligibility(packages)).toBe(true);
  });

  it("clases no es elegible con 5 noches", () => {
    const packages = [makePackage("clases", 4, 5)];
    expect(checkFamilyPlanEligibility(packages)).toBe(false);
  });

  it("ignora paquetes con promo activa", () => {
    const packages = [{ ...makePackage("pases", 4, 8), promo: true }];
    expect(checkFamilyPlanEligibility(packages)).toBe(false);
  });

  it("suma personas de múltiples packages de la misma sección", () => {
    const packages = [makePackage("pases", 2, 8), makePackage("pases", 2, 8)];
    expect(checkFamilyPlanEligibility(packages)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// applyFamilyPlanDiscount
// ---------------------------------------------------------------------------
describe("applyFamilyPlanDiscount", () => {
  const makePackage = (seccion, count, price, noches = 8) => ({
    seccion,
    count,
    price,
    noches,
    promo: false,
    name: `${seccion}-${count}`,
  });

  it("4 personas → 1 gratis (la más barata)", () => {
    const packages = [
      makePackage("pases", 1, 5000), // más cara
      makePackage("pases", 1, 3000), // más barata → gratis
      makePackage("pases", 1, 4000),
      makePackage("pases", 1, 4500),
    ];
    const result = applyFamilyPlanDiscount(packages);
    const promos = result.filter((p) => p.promo);
    expect(promos).toHaveLength(1);
    expect(promos[0].price).toBe(0);
    expect(promos[0].originalPrice).toBe(3000);
  });

  it("6 personas → 2 gratis", () => {
    const packages = [makePackage("pases", 6, 12000, 8)];
    // 6 personas, precio por persona = 2000
    const result = applyFamilyPlanDiscount(packages);
    const promos = result.filter((p) => p.promo);
    expect(promos).toHaveLength(1);
    expect(promos[0].count).toBe(2);
  });

  it("no aplica si menos de 4 personas", () => {
    const packages = [makePackage("pases", 3, 9000)];
    const result = applyFamilyPlanDiscount(packages);
    const promos = result.filter((p) => p.promo);
    expect(promos).toHaveLength(0);
  });

  it("no aplica a secciones no cubiertas (alojamiento)", () => {
    const packages = [makePackage("alojamiento", 4, 20000)];
    const result = applyFamilyPlanDiscount(packages);
    const promos = result.filter((p) => p.promo);
    expect(promos).toHaveLength(0);
  });

  it("no muta los paquetes originales", () => {
    const packages = [makePackage("pases", 4, 4000)];
    applyFamilyPlanDiscount(packages);
    expect(packages[0].promo).toBe(false);
  });

  it("aplica por sección de forma independiente", () => {
    const packages = [
      makePackage("pases", 4, 4000),
      makePackage("equipos", 4, 3000),
    ];
    const result = applyFamilyPlanDiscount(packages);
    const promos = result.filter((p) => p.promo);
    expect(promos).toHaveLength(2); // 1 gratis en pases, 1 en equipos
  });

  it("split correcto cuando solo parte del grupo es gratis", () => {
    // 3 personas en un paquete → 1 queda gratis, 2 pagan
    const packages = [makePackage("pases", 3, 9000), makePackage("pases", 1, 2000)];
    const result = applyFamilyPlanDiscount(packages);
    // La más barata por persona es la de count=1 (2000/persona)
    // Le sigue la de count=3 (3000/persona)
    // Total: 4 personas → 1 gratis
    const promos = result.filter((p) => p.promo);
    expect(promos).toHaveLength(1);
    expect(promos[0].count).toBe(1);
    expect(promos[0].price).toBe(0);
  });
});
