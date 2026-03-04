import React from "react";
import { TableCell, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { formatNumberWithDots } from "@/app/lib/utils/extras";
import DataTable from "../ui/DataTable";
import EmptyState from "../EmptyState";

const PaquetesHoteles = ({ resultados, agregarPaquete, reglas }) => {
  if (!resultados) return null;

  if (Object.keys(resultados).length === 0) {
    return (
      <EmptyState
        title="No hay Alojamientos disponibles"
        description="Ajusta tus filtros de búsqueda e intenta nuevamente. Verifica el centro, fechas y número de personas."
        icon="🏨"
      />
    );
  }

  const handleAddHotel = (hotel, isPackage = false) => {
    const hData = isPackage ? hotel.paquetesUtilizados.paquetes[0] : hotel.paquetesUtilizados;
    const reglasEncontradas = reglas.find((result) => result.hotel === hData.hotel);

    agregarPaquete({
      seccion: "alojamiento",
      reglas: reglasEncontradas?.traduccion || "",
      name: `${hData.hotel} - ${hData.habitacion} - ${hotel.noches} noches - ${
        hotel.mayores > 0 ? "Adultos: " + hotel.mayores : ""
      } ${hotel.menores > 0 ? " Menores: " + hotel.menores : ""}`,
      discount: 0,
      noches: hotel.noches.toString(),
      price: hotel.precioTotal,
      fechaInicio: hotel.fechaInicio,
      fechaFinal: hotel.fechaFinal,
      moneda: hData.moneda,
      menores: hotel.menores,
      mayores: hotel.mayores,
    });
  };

  const renderHotelRow = (hotel) => {
    const hData = !hotel.paquetesUtilizados.paquetes
      ? hotel.paquetesUtilizados
      : hotel.paquetesUtilizados.paquetes[0];

    const rowKey = !hotel.paquetesUtilizados.paquetes
      ? Number(hotel.id) + hotel.precioTotal + hData.habitacion + hData.hotel
      : Number(hotel.id) + hotel.precioTotal + hData.habitacion + hData.hotel;

    return (
      <TableRow key={rowKey}>
        <TableCell>{hData.cerro}</TableCell>
        <TableCell>{hData.hotel}</TableCell>
        <TableCell>{hData.habitacion}</TableCell>
        <TableCell>{hotel.totalPersonas}</TableCell>
        <TableCell>{hData.camaExtra === "Si" ? "✅" : "❌"}</TableCell>
        <TableCell>
          {hData.moneda === "USD" ? "USD" : "$"} {formatNumberWithDots(hotel.precioTotal)}
        </TableCell>
        <TableCell>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600 w-full"
            onClick={() => handleAddHotel(hotel, !!hotel.paquetesUtilizados.paquetes)}
          >
            Agregar
          </Button>
        </TableCell>
      </TableRow>
    );
  };

  const headers = ["Cerro", "Hotel", "Habitación", "Personas", "Cama Extra", "Precio", "Acción"];

  const formatCategoryLabel = (clave) => {
    const label = clave.replace("total_", "");
    const labelMap = {
      mayorista: "Tarifa Mayorista",
      minorista: "Tarifa Minorista",
      publico: "Tarifa Público",
      especial: "Tarifa Especial",
    };
    return labelMap[label] || label.charAt(0).toUpperCase() + label.slice(1);
  };

  return (
    <div className="space-y-6">
      {Object.keys(resultados).map((clave) => {
        const paquetes = resultados[clave];
        const title = formatCategoryLabel(clave);

        return (
          <div key={clave}>
            <DataTable
              headers={headers}
              rows={paquetes}
              renderRow={renderHotelRow}
              title={`🏨 ${title}`}
            />
          </div>
        );
      })}
    </div>
  );
};

export default PaquetesHoteles;
