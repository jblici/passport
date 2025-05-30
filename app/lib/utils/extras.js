export const formatReglas = (text) => {
  return text
    .replace(/;/g, ",") // Reemplaza ; por ,
    .replace(/\. /g, ".\n"); // Agrega un salto de línea después de cada punto
};

export function formatNumberWithDots(number) {
  // Redondear al entero más cercano
  const roundedNumber = Math.round(Number(number));

  // Formatear con puntos como separadores de miles
  return roundedNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function formatNumberPercentage(number, total) {
  if (!number || !total) return 0;
  console.log(number, total);
  return Math.round((number * 100) / total);
}

export const formatDate = (date, dias) => {
  const fecha = new Date(date);

  // Formatear fecha inicial
  const dia = ("0" + fecha.getDate()).slice(-2); // Asegura que el día tenga 2 dígitos
  const mes = ("0" + (fecha.getMonth() + 1)).slice(-2); // Meses son 0-indexados, por eso se suma 1
  const anio = fecha.getFullYear();

  const fechaInicial = `${dia}/${mes}/${anio}`;

  // Sumar días a la fecha inicial
  fecha.setDate(fecha.getDate() + dias);

  // Formatear la fecha final después de sumar los días
  const diaFinal = ("0" + fecha.getDate()).slice(-2); // Asegura que el día tenga 2 dígitos
  const mesFinal = ("0" + (fecha.getMonth() + 1)).slice(-2); // Meses son 0-indexados, por eso se suma 1
  const anioFinal = fecha.getFullYear();

  const fechaFinal = `${diaFinal}/${mesFinal}/${anioFinal}`;

  return { fechaInicial, fechaFinal };
};

export const stringDate = (dateString) => {
  const date = new Date(dateString);

  if (isNaN(date)) return "Fecha inválida"; // Verifica si la fecha es válida

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() devuelve 0-11, por eso sumamos 1
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export function sumarDias(fecha, dias) {
  // Asegúrate de que fecha sea un objeto Date
  const fechaObj = new Date(fecha);

  // Sumar los días
  fechaObj.setDate(fechaObj.getDate() + dias);

  return fechaObj; // Devuelve la nueva fecha
}

export const scrollToSection = () => {
  document.getElementById("busqueda").scrollIntoView({ behavior: "smooth" });
};

export const verificarFamilyPlan = (
  paquetesTemp,
  isChecked,
  setFamilyPlan,
  setPaquetesSeleccionados,
  setFlag,
  setIsChecked
) => {
  //console.log('verificarFamilyPlan')
  const secciones = ["pases", "equipos", "clases"];
  let activarFamilyPlan = false;
  const nuevosPaquetes = JSON.parse(JSON.stringify(paquetesTemp));

  //console.log("entre a verificar family plan");

  secciones.forEach((seccion) => {
    const paquetesPorSeccion = nuevosPaquetes.filter((paquete) => {
      const esSeccionClases = seccion === "clases";
      const minDias = esSeccionClases ? 6 : 8;
      //console.log('nuevosPaquetes', nuevosPaquetes)

      return (
        paquete.seccion === seccion && // Coincide con la sección
        !paquete.promo && // No es promo
        Number(paquete.noches) >= minDias // Cumple con el mínimo de días según la sección
      );
    });

    const totalCount = paquetesPorSeccion.reduce((sum, paquete) => sum + paquete.count, 0);

    //console.log('paquetes', paquetesPorSeccion)

    //console.log('totalCount', totalCount)

    if (totalCount >= 4) {
      // Activar Family Plan si se cumplen las condiciones
      setFamilyPlan(true);
      activarFamilyPlan = true;

      let restante = totalCount >= 4 && totalCount < 6 ? 1 : 2; // Determina cuántos paquetes necesitamos procesar
      //console.log("Restante", restante);

      if (isChecked) {
        while (restante > 0) {
          // Buscar el paquete más barato que no tenga promo
          const paqueteMasBarato = paquetesPorSeccion.reduce((min, paquete) =>
            paquete.price < min.price ? paquete : min
          );

          if (paqueteMasBarato.count > 1) {
            // Si el paquete tiene más de 1, reducimos su count y creamos uno con promo
            paqueteMasBarato.count -= 1;
            paqueteMasBarato.price =
              (paqueteMasBarato.price / (paqueteMasBarato.count + 1)) * paqueteMasBarato.count;
            nuevosPaquetes.push({
              ...paqueteMasBarato,
              count: 1,
              oldPrice: paqueteMasBarato.price / 4,
              price: 0, // Precio 0 para paquetes con promo
              promo: true,
            });

            restante--;
          } else {
            // Si el paquete tiene count === 1, lo marcamos como promo
            const index = nuevosPaquetes.findIndex((paquete) => paquete === paqueteMasBarato);
            nuevosPaquetes[index] = {
              ...paqueteMasBarato,
              price: 0, // Precio 0 para paquetes con promo
              promo: true,
            };

            // Remover de paquetesPorSeccion para no procesarlo nuevamente
            const seccionIndex = paquetesPorSeccion.findIndex(
              (paquete) => paquete === paqueteMasBarato
            );
            paquetesPorSeccion.splice(seccionIndex, 1);
            restante--;
          }
        }
      }
    }
  });

  // Actualiza el estado solo si es necesario
  if (activarFamilyPlan) {
    setFamilyPlan(true);
    if (isChecked) {
      setPaquetesSeleccionados(nuevosPaquetes);
      setFlag(false);
    }
  } else {
    setFamilyPlan(false);
    setIsChecked(false);
  }
};
