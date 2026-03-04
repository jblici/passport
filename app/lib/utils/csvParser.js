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
 */
export const parseCSV = (csv, mapper, minColumns) => {
  try {
    return csv
      .split("\n")
      .slice(1) // Skip header row
      .filter((row) => row.trim())
      .map((row, index) => {
        try {
          return mapper(row);
        } catch (err) {
          console.warn(`Error parsing row ${index + 1}:`, err);
          return null;
        }
      })
      .filter((row) => row !== null);
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
