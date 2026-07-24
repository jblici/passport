/**
 * Reusable CSV parsing utilities
 * Consolidates duplicated parsing logic from paquetes.js and spreadsheet.js
 */

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 horas
const CACHE_PREFIX = "csv_cache_";

const getCached = (url) => {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + url);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL_MS) {
      localStorage.removeItem(CACHE_PREFIX + url);
      return null;
    }
    return data;
  } catch {
    return null;
  }
};

const setCache = (url, data) => {
  try {
    localStorage.setItem(CACHE_PREFIX + url, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    // localStorage lleno u otro error — ignorar, la app sigue funcionando
  }
};

/**
 * Fetch CSV data from a URL with error handling.
 * Cachea en localStorage por 24hs para reducir requests a Google Sheets.
 */
export const fetchCSV = async (url) => {
  const cached = getCached(url);
  if (cached) return cached;

  try {
    const response = await fetch(url, { redirect: "follow" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch ${url}`);
    }
    const text = await response.text();

    if (!text || text.trim().length === 0) {
      throw new Error("CSV file is empty");
    }

    setCache(url, text);
    return text;
  } catch (err) {
    console.error("Error fetching CSV:", err);
    throw err;
  }
};

/**
 * Split CSV text into rows respecting quoted fields (RFC 4180).
 * Handles cells that contain newlines or commas inside double quotes.
 */
export const splitCSVRows = (csv) => {
  const lines = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const ch = csv[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      current += ch;
    } else if (ch === "\r") {
      // skip carriage returns
    } else if (ch === "\n" && !inQuotes) {
      if (current.trim()) lines.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) lines.push(current);
  return lines;
};

/**
 * Split a single CSV row into columns respecting quoted fields.
 * Handles commas and embedded newlines inside double quotes.
 * Replaces row.split(",") in all mappers.
 */
export const splitCSVRow = (row) => {
  const cols = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      // Strip surrounding quotes from value (don't add the quote char itself)
    } else if (ch === "," && !inQuotes) {
      cols.push(current);
      current = "";
    } else if ((ch === "\n" || ch === "\r") && inQuotes) {
      // Strip embedded newlines inside quoted fields
    } else {
      current += ch;
    }
  }
  cols.push(current);
  return cols;
};

/**
 * Parse CSV text into objects using a mapper function.
 * Uses RFC 4180-compliant row and column splitting.
 */
export const parseCSV = (csv, mapper) => {
  try {
    const rows = splitCSVRows(csv);
    const dataRows = rows.slice(1); // skip header

    const parsed = [];
    const errors = [];

    dataRows.forEach((row, index) => {
      try {
        const result = mapper(row);
        if (result !== null && result !== undefined) parsed.push(result);
      } catch (err) {
        errors.push({
          rowNumber: index + 2,
          rowContent: row.substring(0, 50),
          error: err.message,
        });
      }
    });

    if (errors.length > 0) {
      const errorSummary = errors
        .slice(0, 3)
        .map((e) => `Row ${e.rowNumber}: ${e.error}`)
        .join("; ");
      const totalMessage =
        errors.length > 3
          ? `${errorSummary}... (${errors.length - 3} more errors)`
          : errorSummary;

      console.warn(
        `CSV parsing: ${parsed.length} rows parsed, ${errors.length} rows skipped due to errors: ${totalMessage}`
      );
    }

    return parsed;
  } catch (err) {
    console.error("Error in parseCSV:", err);
    throw err;
  }
};

/**
 * Validate that a CSV row has minimum required columns
 */
export const validateColumns = (columns, minRequired, errorPrefix = "Row") => {
  if (columns.length < minRequired) {
    throw new Error(
      `${errorPrefix} has insufficient columns (${columns.length}/${minRequired})`
    );
  }
};

/**
 * Helper to trim all strings in an array and provide defaults
 */
export const trimColumns = (columns) => {
  return columns.map((col) => col?.trim() || "");
};

/**
 * Helper to safely convert a value to a number
 */
export const toNumber = (value) => {
  return Number(value) || 0;
};

/**
 * Helper to safely convert a value to a rounded integer (for prices)
 */
export const toRoundedNumber = (value) => {
  return Math.round(Number(value)) || 0;
};
