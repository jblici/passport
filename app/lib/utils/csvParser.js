/**
 * Reusable CSV parsing utilities
 * Consolidates duplicated parsing logic from paquetes.js and spreadsheet.js
 */

/**
 * Fetch CSV data from a URL with error handling
 */
export const fetchCSV = async (url) => {
  try {
    const response = await fetch(url, { redirect: "follow" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch ${url}`);
    }
    const text = await response.text();

    if (!text || text.trim().length === 0) {
      throw new Error("CSV file is empty");
    }

    return text;
  } catch (err) {
    console.error("Error fetching CSV:", err);
    throw err;
  }
};

/**
 * Parse CSV text into objects using a mapper function
 * @param {string} csv - Raw CSV text
 * @param {function} mapper - Function that transforms a CSV row into an object
 * @param {number} minColumns - Minimum expected columns (for validation)
 * @returns {Array} Parsed rows
 * @throws {Error} If parsing fails with details about which rows failed
 */
export const parseCSV = (csv, mapper, minColumns) => {
  try {
    const rows = csv.split("\n");
    const header = rows[0]; // Keep header for reference
    const dataRows = rows.slice(1).filter((row) => row.trim());

    const parsed = [];
    const errors = [];

    dataRows.forEach((row, index) => {
      try {
        const result = mapper(row);
        parsed.push(result);
      } catch (err) {
        errors.push({
          rowNumber: index + 2, // +2 because we skip header and 0-indexed
          rowContent: row.substring(0, 50), // First 50 chars for context
          error: err.message,
        });
      }
    });

    // Report errors if any rows failed to parse
    if (errors.length > 0) {
      const errorSummary = errors
        .slice(0, 3) // Show first 3 errors
        .map((e) => `Row ${e.rowNumber}: ${e.error}`)
        .join("; ");
      const totalMessage = errors.length > 3
        ? `${errorSummary}... (${errors.length - 3} more errors)`
        : errorSummary;

      console.warn(`CSV parsing: ${parsed.length} rows parsed, ${errors.length} rows skipped due to errors: ${totalMessage}`);
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
