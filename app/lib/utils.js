import jsPDF from 'jspdf';

export const generatePDF = (paquetesSeleccionados, totalCompra) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Presupuesto valido hasta Fecha X', 14, 22);

  doc.setFontSize(12);
  paquetesSeleccionados.forEach((paquete, index) => {
    doc.text(`${paquete.name}: $${paquete.price}`, 14, 30 + (index * 10));
  });

  doc.setFontSize(16);
  doc.text(`Total: $${totalCompra}`, 14, 30 + (paquetesSeleccionados.length * 10) + 10);

  doc.save('cotizacion.pdf');
};

export const handleSubmit = (paquetes, startDate, endDate, pax, setResultados) => (e) => {
  e.preventDefault();
  const filteredPaquetes = paquetes.filter((paquete) => {
    const paqueteStartDate = new Date(paquete.dateInit);
    const paqueteEndDate = new Date(paquete.dateEnd);

    const isWithinDateRange =
      (!startDate || new Date(startDate) >= paqueteStartDate) &&
      (!endDate || new Date(endDate) <= paqueteEndDate);

    return (
      isWithinDateRange && (!pax || paquete.persons === parseInt(pax))
    );
  });

  setResultados(filteredPaquetes);
};