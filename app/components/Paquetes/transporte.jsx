import { TableCell, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import DataTable from "../ui/DataTable";
import EmptyState from "../EmptyState";
import CountSelect from "../ui/CountSelect";
import useSelectedCounts from "@/app/lib/hooks/useSelectedCounts";
import { formatNumberWithDots } from "@/app/lib/utils/extras";

const PaquetesTransporte = ({ resultados, agregarPaquete }) => {
  const { selectedCounts, handleCountChange } = useSelectedCounts();

  if (!resultados || Object.keys(resultados).length === 0) {
    return (
      <EmptyState
        title="No hay Transporte disponible"
        description="No se encontraron opciones de transporte para tu búsqueda. Intenta con otros filtros."
        icon="🚌"
      />
    );
  }

  const handleAddTransporte = (transporte, index, tipoTramo = null) => {
    const count = selectedCounts[index] || 1;

    agregarPaquete({
      seccion: "transporte",
      fechaInicio: transporte.inicio,
      fechaFin: transporte.fin,
      clave: tipoTramo,
      name: `${transporte.descripcion} - ${transporte.origen} / ${transporte.destino}${
        transporte.personas > 1
          ? ` - ${transporte.personas} PAX${count > 1 ? ` x ${count}` : ""}`
          : count > 1
            ? ` x ${count}`
            : ""
      }`,
      price: transporte.precio * count,
    });
  };

  const renderTransporteRow = (transporte, index, tipoTramo = null) => (
    <TableRow key={`transporte-${index}`}>
      <TableCell>{transporte.cerro}</TableCell>
      <TableCell>{transporte.servicio}</TableCell>
      <TableCell>{transporte.origen}</TableCell>
      <TableCell>{transporte.destino}</TableCell>
      <TableCell>{transporte.descripcion.toLowerCase()}</TableCell>
      <TableCell>{transporte.personas}</TableCell>
      <TableCell>$ {formatNumberWithDots(transporte.precio)}</TableCell>
      <TableCell className="w-px whitespace-nowrap">
        <div className="flex gap-2 items-center justify-end">
          <CountSelect
            index={index}
            value={selectedCounts[index] || 1}
            onChange={handleCountChange}
          />
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={() => handleAddTransporte(transporte, index, tipoTramo)}
          >
            Agregar
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );

  const headers = [
    "Cerro",
    "Servicio",
    "Origen",
    "Destino",
    "Descripción",
    "Pax",
    "Precio",
    "Acción",
  ];

  // Si es un array simple (sin ida/vuelta separadas)
  if (!resultados.ida) {
    return (
      <DataTable
        headers={headers}
        rows={resultados}
        renderRow={renderTransporteRow}
        title="🚌 Transporte"
      />
    );
  }

  // Si tiene ida/vuelta separadas
  return (
    <div className="space-y-6">
      {Object.keys(resultados).map((tipoTramo) => {
        const labelMap = { ida: "🚌 Ida", vuelta: "🚌 Vuelta", idayvuelta: "🚌 Ida y Vuelta" };
        const label = labelMap[tipoTramo] || `🚌 ${tipoTramo.charAt(0).toUpperCase() + tipoTramo.slice(1)}`;
        return (
          <DataTable
            key={tipoTramo}
            headers={headers}
            rows={resultados[tipoTramo]}
            renderRow={(row, index) => renderTransporteRow(row, index, tipoTramo)}
            title={label}
          />
        );
      })}
    </div>
  );
};

export default PaquetesTransporte;
