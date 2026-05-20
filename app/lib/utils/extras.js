export const formatReglas = (text) => {
  return text
    .replace(/;/g, ",")
    .replace(/\. /g, ".\n");
};

export function formatNumberWithDots(number) {
  const roundedNumber = Math.round(Number(number));
  return roundedNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function formatNumberPercentage(number, total) {
  if (!number || !total) return 0;
  return Math.round((number * 100) / total);
}

export const formatDate = (date, dias) => {
  const fecha = new Date(date);
  const fechaInicial = stringDate(fecha);
  fecha.setDate(fecha.getDate() + dias);
  const fechaFinal = stringDate(fecha);
  return { fechaInicial, fechaFinal };
};

export const stringDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) return "Fecha inválida";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export function sumarDias(fecha, dias) {
  const fechaObj = new Date(fecha);
  fechaObj.setDate(fechaObj.getDate() + dias);
  return fechaObj;
}

export const scrollToSection = () => {
  document.getElementById("busqueda").scrollIntoView({ behavior: "smooth" });
};

// Devuelve true si alguna sección tiene 4+ personas que califican para el Family Plan
export const checkFamilyPlanEligibility = (packages) => {
  const secciones = ["pases", "equipos", "clases"];
  return secciones.some((seccion) => {
    const minDias = seccion === "clases" ? 6 : 8;
    const qualifying = packages.filter(
      (p) => p.seccion === seccion && !p.promo && Number(p.noches) >= minDias
    );
    const totalPersonas = qualifying.reduce((sum, p) => sum + p.count, 0);
    return totalPersonas >= 4;
  });
};

// Aplica el descuento Family Plan: la persona más barata (por precio unitario) queda gratis.
// 4-5 personas → 1 gratis. 6+ personas → 2 gratis. Se aplica por sección de forma independiente.
export const applyFamilyPlanDiscount = (packages) => {
  const result = JSON.parse(JSON.stringify(packages));
  const secciones = ["pases", "equipos", "clases"];

  secciones.forEach((seccion) => {
    const minDias = seccion === "clases" ? 6 : 8;

    // Track original index to avoid fragile reference-equality lookups after deep clone
    const qualifying = result
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => p.seccion === seccion && !p.promo && Number(p.noches) >= minDias);

    const totalPersonas = qualifying.reduce((sum, { p }) => sum + p.count, 0);
    if (totalPersonas < 4) return;

    const gratuitos = totalPersonas >= 6 ? 2 : 1;

    // Sort ascending by price-per-person → cheapest gets free slot first
    const sorted = [...qualifying].sort(
      ({ p: a }, { p: b }) => a.price / a.count - b.price / b.count
    );

    let remaining = gratuitos;

    for (const { p: pkg, i: idx } of sorted) {
      if (remaining <= 0) break;

      const pricePerPerson = pkg.price / pkg.count;
      const freeCount = Math.min(remaining, pkg.count);

      if (pkg.count > freeCount) {
        // Only some in the group are free → split the item
        const payingCount = pkg.count - freeCount;
        result[idx] = { ...pkg, count: payingCount, price: pricePerPerson * payingCount };
        result.push({
          ...pkg,
          count: freeCount,
          price: 0,
          promo: true,
          originalPrice: pricePerPerson * freeCount,
        });
      } else {
        // Entire item is free
        result[idx] = { ...pkg, price: 0, promo: true, originalPrice: pkg.price };
      }

      remaining -= freeCount;
    }
  });

  return result;
};
