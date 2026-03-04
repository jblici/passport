/**
 * Reusable filtering and price calculation strategies
 * Consolidates duplicated logic from secciones.js and hoteles.js
 */

/**
 * Check if a date falls within a date range or overlaps with a selected period
 * Used for Castor and Chapelco (flexible date range matching)
 */
export const dateOverlapsCentroDates = (
  selectedStart,
  selectedEnd,
  centroDateStart,
  centroDayEnd
) => {
  return (
    (centroDateStart <= selectedStart && selectedStart <= centroDayEnd) ||
    (centroDateStart <= selectedEnd && selectedEnd <= centroDayEnd) ||
    (selectedStart <= centroDateStart && selectedEnd >= centroDayEnd)
  );
};

/**
 * Check if selected start date falls within centro date range
 * Used for Las Leñas and other centros
 */
export const dateContainsStart = (selectedStart, centroDateStart, centroDayEnd) => {
  return centroDateStart <= selectedStart && selectedStart <= centroDayEnd;
};

/**
 * Group items by a specific attribute (e.g., edad, gama)
 * Returns an object where keys are attribute values and values are arrays of items
 */
export const groupByAttribute = (items, attributeKey) => {
  return items.reduce((acc, item) => {
    const key = item[attributeKey] || "default";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
};

/**
 * Calculate price for a room based on adults and children
 * Handles extra bed pricing when applicable
 */
export const calculateRoomPrice = (paquete, mayores, menores, useExtraBed) => {
  if (useExtraBed && paquete.personas === mayores + menores - 1) {
    // Using extra bed (one person uses the extra bed instead of regular bed)
    if (menores > 0) {
      return (
        paquete.extraMenor * 1 +
        (paquete.precioMenor
          ? paquete.precioMenor * (menores - 1)
          : paquete.precio * (menores - 1)) +
        paquete.precio * (mayores - 1)
      );
    } else {
      return paquete.extraMayor * 1 + paquete.precio * (mayores - 1);
    }
  } else {
    // Normal pricing without extra bed
    return (
      paquete.precio * mayores +
      (paquete.precioMenor ? paquete.precioMenor * menores : paquete.precio * menores)
    );
  }
};

/**
 * Filter items by centro with case-insensitive matching
 */
export const filterByCentro = (items, cerro, centroField = "cerro") => {
  if (!cerro) return items;
  return items.filter(
    (item) => item[centroField].toUpperCase() === cerro.toUpperCase()
  );
};

/**
 * Filter items by a specific attribute with case-insensitive matching
 */
export const filterByAttribute = (items, attributeKey, value, caseInsensitive = false) => {
  if (!value) return items;

  if (caseInsensitive) {
    const upperValue = value.toUpperCase();
    return items.filter(
      (item) => item[attributeKey]?.toUpperCase() === upperValue
    );
  }

  return items.filter((item) => item[attributeKey] === value);
};

/**
 * Filter items by days (exact match or inclusive for day 1)
 */
export const filterByDays = (items, dias, daysField = "dias") => {
  if (!dias) return items;

  return items.filter((item) => {
    const itemDays = Number(item[daysField]);
    return dias === 1 ? itemDays <= dias : itemDays === dias;
  });
};

/**
 * Sort items by price (ascending)
 */
export const sortByPrice = (items, priceField = "precio") => {
  return [...items].sort((a, b) => Number(a[priceField]) - Number(b[priceField]));
};

/**
 * Filter items with special handling for flexible pass types (Chapelco)
 */
export const filterPassType = (items, tipo, cerro) => {
  if (!tipo) return items;

  if (cerro === "Chapelco") {
    const upperTipo = tipo.toUpperCase();
    if (upperTipo === "FLEXIBLE") {
      return items.filter((item) => item.tipo.toUpperCase().includes("FLEXIBLE"));
    } else if (upperTipo === "NORMAL") {
      return items.filter((item) => !item.tipo.toUpperCase().includes("FLEXIBLE"));
    }
  }

  return items.filter((item) => item.tipo.toUpperCase() === tipo.toUpperCase());
};

/**
 * Filter transfer by class type with special handling for Castor/Chapelco
 * @param {Array} items - Transport items to filter
 * @param {string} claseTransporte - "Privado" or other
 * @param {string} cerro - Centro name
 * @returns {Array} Filtered items
 */
export const filterTransportClass = (items, claseTransporte, cerro) => {
  if (!claseTransporte) return items;

  if (claseTransporte === "Privado") {
    if (cerro === "Castor" || cerro === "Chapelco") {
      return items.filter(
        (item) =>
          item.descripcion.toLowerCase().includes("privado") ||
          item.descripcion.toLowerCase().includes("privada")
      );
    } else {
      return items.filter((item) => item.personas > 1);
    }
  } else {
    // Public transport
    if (cerro === "Castor" || cerro === "Chapelco") {
      return items.filter(
        (item) =>
          !item.descripcion.toLowerCase().includes("privado") &&
          !item.descripcion.toLowerCase().includes("privada")
      );
    } else {
      return items.filter((item) => item.personas === 1);
    }
  }
};

/**
 * Filter transport by segment (Ida, Vuelta, Ida y Vuelta)
 */
export const filterBySegment = (items, segment) => {
  if (!segment) return items;
  return items.filter((item) => item.tramo === segment);
};
