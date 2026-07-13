"use client";
import { TableCell, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { formatNumberWithDots } from "@/app/lib/utils/extras";
import CountSelect from "../ui/CountSelect";
import useSelectedCounts from "@/app/lib/hooks/useSelectedCounts";
import DataTable from "../ui/DataTable";
import EmptyState from "../EmptyState";

const PaquetesClases = ({ resultados, agregarPaquete }) => {
  const { selectedCounts, handleCountChange } = useSelectedCounts();

  if (!resultados || resultados.length === 0) {
    return (
      <EmptyState
        title="No hay Clases disponibles"
        description="No se encontraron opciones de clases para tu búsqueda. Intenta con otros filtros."
        icon="👨‍🏫"
      />
    );
  }

  const calculatePrice = (clase) => {
    let precioBase = clase.precio;
    let cantidadPersonas = 1;

    if (clase.cerro === "Castor" && clase.tipo.toLowerCase().includes("privada")) {
      const partes = clase.tipo.split(" - ");
      if (partes.length > 1) {
        const match = partes[1].match(/\d+/);
        if (match) {
          cantidadPersonas = parseInt(match[0], 10);
        }
      }
    }
    return precioBase * cantidadPersonas;
  };

  const handleAddClase = (clase, index) => {
    const cData = clase.paquete || clase;
    const count = selectedCounts[index] || 1;
    const precioFinal = calculatePrice(clase);

    agregarPaquete({
      seccion: "clases",
      noches: cData.dias,
      count: Number(count),
      name: `Clase ${cData.tipo} (${cData.edad}) - ${cData.dias} días`,
      price: precioFinal * count,
    });
  };

  const renderClaseRow = (clase, index) => {
    const cData = clase.paquete || clase;
    const precioFinal = calculatePrice(clase);

    return (
      <TableRow key={index}>
        <TableCell>{cData.cerro}</TableCell>
        <TableCell>{cData.tipo}</TableCell>
        <TableCell>{cData.dias}</TableCell>
        <TableCell>{cData.edad}</TableCell>
        <TableCell>$ {formatNumberWithDots(precioFinal)}</TableCell>
        <TableCell className="w-px whitespace-nowrap">
          <div className="flex gap-2 items-center justify-end">
            <CountSelect
              index={index}
              value={selectedCounts[index] || 1}
              onChange={handleCountChange}
            />
            <Button
              className="bg-blue-500 text-white hover:bg-blue-600"
              onClick={() => handleAddClase(clase, index)}
            >
              Agregar
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  const headers = ["Cerro", "Tipo", "Días", "Edades", "Precio", "Acción"];

  return (
    <DataTable
      headers={headers}
      rows={resultados}
      renderRow={renderClaseRow}
      title="👨‍🏫 Clases de Esquí"
    />
  );
};

export default PaquetesClases;
