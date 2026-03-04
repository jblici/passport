import { useState } from "react";
import { TableCell, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { formatNumberWithDots } from "@/app/lib/utils/extras";
import DataTable from "../ui/DataTable";
import EmptyState from "../EmptyState";

const PaquetesPases = ({ resultados, agregarPaquete }) => {
  const [selectedCounts, setSelectedCounts] = useState({});

  if (!resultados || resultados.length === 0) {
    return (
      <EmptyState
        title="No hay Medios de Elevación disponibles"
        description="No se encontraron opciones para tu búsqueda. Intenta con otros filtros."
        icon="🚡"
      />
    );
  }

  const handleCountChange = (index, value) => {
    setSelectedCounts((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const handleAddPass = (pass, index) => {
    const pData = pass.paquete || pass;
    const count = selectedCounts[index] || 1;

    agregarPaquete({
      seccion: "pases",
      noches: pData.dias,
      count: Number(count),
      name: `Medios de Elevación: ${pData.tipo} - ${pData.edad} - ${pData.dias} días`,
      price: pass.precio * count,
    });
  };

  const renderPassRow = (pass, index) => {
    const pData = pass.paquete || pass;

    return (
      <TableRow key={`pase-${index}`}>
        <TableCell>{pData.cerro}</TableCell>
        <TableCell>{pData.dias}</TableCell>
        <TableCell>{pData.edad}</TableCell>
        <TableCell>{pData.tipo}</TableCell>
        <TableCell>{pData.pack}</TableCell>
        <TableCell>$ {formatNumberWithDots(pass.precio)}</TableCell>
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
              onClick={() => handleAddPass(pass, index)}
            >
              Agregar
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  const headers = ["Cerro", "Días", "Edad", "Tipo", "Pack", "Precio", "Acción"];

  return (
    <DataTable
      headers={headers}
      rows={resultados}
      renderRow={renderPassRow}
      title="🚡 Medios de Elevación"
    />
  );
};

export default PaquetesPases;
