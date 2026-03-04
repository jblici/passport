import { useState } from "react";
import { TableCell, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { formatNumberWithDots } from "@/app/lib/utils/extras";
import DataTable from "../ui/DataTable";
import EmptyState from "../EmptyState";

const PaquetesEquipos = ({ resultados, agregarPaquete }) => {
  const [selectedCounts, setSelectedCounts] = useState({});

  if (!resultados || resultados.length === 0) {
    return (
      <EmptyState
        title="No hay Equipos disponibles"
        description="No se encontraron rentals para tu búsqueda. Intenta con otros filtros."
        icon="🎿"
      />
    );
  }

  const handleCountChange = (index, value) => {
    setSelectedCounts((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const handleAddEquipo = (equipo, index) => {
    const eData = equipo.paquete || equipo;
    const count = selectedCounts[index] || 1;

    agregarPaquete({
      seccion: "equipos",
      noches: eData.dias,
      count: Number(count),
      name: `${eData.articulo} - ${eData.edad} - ${eData.gama} - ${eData.dias} días`,
      price: equipo.precio * count,
    });
  };

  const renderEquipoRow = (equipo, index) => {
    const eData = equipo.paquete || equipo;

    return (
      <TableRow key={index}>
        <TableCell>{eData.cerro}</TableCell>
        <TableCell>{eData.gama.toLowerCase()}</TableCell>
        <TableCell>{eData.articulo.toLowerCase()}</TableCell>
        <TableCell>{eData.edad.toLowerCase()}</TableCell>
        <TableCell>{eData.dias}</TableCell>
        <TableCell>$ {formatNumberWithDots(equipo.precio)}</TableCell>
        <TableCell>
          <div className="flex gap-2">
            <select
              value={selectedCounts[index] || 1}
              onChange={(e) => handleCountChange(index, e.target.value)}
              className="px-2 py-1 border rounded"
            >
              {[...Array(5).keys()].map((num) => (
                <option key={num + 1} value={num + 1}>
                  {num + 1}
                </option>
              ))}
            </select>
            <Button
              className="bg-blue-500 text-white hover:bg-blue-600"
              onClick={() => handleAddEquipo(equipo, index)}
            >
              Agregar
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  const headers = ["Cerro", "Gama", "Artículo", "Edad", "Días", "Precio", "Acción"];

  return (
    <DataTable
      headers={headers}
      rows={resultados}
      renderRow={renderEquipoRow}
      title="🎿 Alquiler de Equipos"
    />
  );
};

export default PaquetesEquipos;
