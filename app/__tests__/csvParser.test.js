import { describe, it, expect, vi } from "vitest";
import {
  splitCSVRow,
  splitCSVRows,
  parseCSV,
  validateColumns,
  trimColumns,
  toNumber,
  toRoundedNumber,
} from "../lib/utils/csvParser";

// ---------------------------------------------------------------------------
// splitCSVRow
// ---------------------------------------------------------------------------
describe("splitCSVRow", () => {
  it("separa columnas simples por coma", () => {
    expect(splitCSVRow("Catedral,Adulto,100")).toEqual(["Catedral", "Adulto", "100"]);
  });

  it("maneja campo vacío", () => {
    expect(splitCSVRow("Catedral,,100")).toEqual(["Catedral", "", "100"]);
  });

  it("respeta comillas: coma dentro de campo no separa", () => {
    expect(splitCSVRow('"Las Leñas, Valle",Adulto,200')).toEqual([
      "Las Leñas, Valle",
      "Adulto",
      "200",
    ]);
  });

  it("strip quotes del campo", () => {
    const cols = splitCSVRow('"Cerro Castor",Menor,150');
    expect(cols[0]).toBe("Cerro Castor");
  });

  it("campo con punto y coma dentro de comillas no rompe", () => {
    const cols = splitCSVRow('"texto; con punto",valor,123');
    expect(cols[0]).toBe("texto; con punto");
    expect(cols).toHaveLength(3);
  });

  it("última columna sin coma final", () => {
    const cols = splitCSVRow("a,b,c");
    expect(cols).toHaveLength(3);
    expect(cols[2]).toBe("c");
  });
});

// ---------------------------------------------------------------------------
// splitCSVRows
// ---------------------------------------------------------------------------
describe("splitCSVRows", () => {
  it("separa filas por newline", () => {
    const csv = "header\nfila1\nfila2";
    expect(splitCSVRows(csv)).toEqual(["header", "fila1", "fila2"]);
  });

  it("ignora filas vacías", () => {
    const csv = "header\n\nfila1\n";
    const rows = splitCSVRows(csv);
    expect(rows).not.toContain("");
    expect(rows).toHaveLength(2);
  });

  it("maneja \\r\\n (Windows line endings)", () => {
    const csv = "header\r\nfila1\r\nfila2";
    const rows = splitCSVRows(csv);
    expect(rows).toHaveLength(3);
    expect(rows[1]).toBe("fila1");
  });

  it("no separa newline dentro de campo entre comillas", () => {
    const csv = 'header\n"campo\ncon salto",valor\nfila2';
    const rows = splitCSVRows(csv);
    // La fila con el campo multilínea y fila2 → 2 filas de datos + header = 3 total
    expect(rows).toHaveLength(3);
  });
});

// ---------------------------------------------------------------------------
// parseCSV
// ---------------------------------------------------------------------------
describe("parseCSV", () => {
  it("skipea la primera fila (header)", () => {
    const csv = "cerro,precio\nCatedral,1000\nChapelco,2000";
    const mapper = (row) => {
      const cols = splitCSVRow(row);
      return { cerro: cols[0], precio: Number(cols[1]) };
    };
    const result = parseCSV(csv, mapper);
    expect(result).toHaveLength(2);
    expect(result[0].cerro).toBe("Catedral");
  });

  it("filtra filas donde mapper devuelve null", () => {
    const csv = "cerro\nCatedral\n\nChapelco";
    const mapper = (row) => (row.trim() ? { cerro: row } : null);
    const result = parseCSV(csv, mapper);
    expect(result).toHaveLength(2);
  });

  it("logea warn si hay filas con error pero sigue parseando", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const csv = "header\nbuena\nmala";
    let calls = 0;
    const mapper = (row) => {
      calls++;
      if (row === "mala") throw new Error("fila mala");
      return { val: row };
    };
    const result = parseCSV(csv, mapper);
    expect(result).toHaveLength(1);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// validateColumns
// ---------------------------------------------------------------------------
describe("validateColumns", () => {
  it("no lanza si hay suficientes columnas", () => {
    expect(() => validateColumns(["a", "b", "c"], 3)).not.toThrow();
  });

  it("lanza si hay menos columnas de las requeridas", () => {
    expect(() => validateColumns(["a", "b"], 3)).toThrow();
  });
});

// ---------------------------------------------------------------------------
// trimColumns
// ---------------------------------------------------------------------------
describe("trimColumns", () => {
  it("trim a todas las columnas", () => {
    expect(trimColumns(["  Catedral  ", " 100 ", ""])).toEqual(["Catedral", "100", ""]);
  });

  it("reemplaza undefined por string vacío", () => {
    expect(trimColumns([undefined, "valor"])).toEqual(["", "valor"]);
  });
});

// ---------------------------------------------------------------------------
// toNumber / toRoundedNumber
// ---------------------------------------------------------------------------
describe("toNumber", () => {
  it("convierte string a número", () => {
    expect(toNumber("100")).toBe(100);
    expect(toNumber("3.5")).toBe(3.5);
  });

  it("devuelve 0 para valores no numéricos", () => {
    expect(toNumber("")).toBe(0);
    expect(toNumber("abc")).toBe(0);
    expect(toNumber(undefined)).toBe(0);
  });
});

describe("toRoundedNumber", () => {
  it("redondea al entero más cercano", () => {
    expect(toRoundedNumber("100.7")).toBe(101);
    expect(toRoundedNumber("100.2")).toBe(100);
  });

  it("devuelve 0 para valores inválidos", () => {
    expect(toRoundedNumber("")).toBe(0);
    expect(toRoundedNumber(undefined)).toBe(0);
  });
});
