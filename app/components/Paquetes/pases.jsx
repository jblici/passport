import { TableCell, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { formatNumberWithDots } from "@/app/lib/utils/extras";
import DataTable from "../ui/DataTable";
import CountSelect from "../ui/CountSelect";
import useSelectedCounts from "@/app/lib/hooks/useSelectedCounts";
import EmptyState from "../EmptyState";

const PaquetesPases = ({ resultados, agregarPaquete }) => {
  const { selectedCounts, handleCountChange } = useSelectedCounts();

  if (!resultados || resultados.length === 0) {
    return (
      <EmptyState
        title="No hay Medios de Elevación disponibles"
        description="No se encontraron opciones para tu búsqueda. Intenta con otros filtros."
        icon="🚡"
      />
    );
  }

  const handleAddPass = (pass, index) => {
    const pData = pass.paquete || pass;
    const count = selectedCounts[index] || 1;

    agregarPaquete({
      seccion: "pases",
      noches: pData.dias,
      count: Number(count),
      name: `${pData.tipo} - ${pData.edad} - ${pData.dias} días`,
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
        <TableCell className="w-px whitespace-nowrap">
          <div className="flex gap-2 items-center justify-end">
            <CountSelect
              index={index}
              value={selectedCounts[index] || 1}
              onChange={handleCountChange}
            />
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
