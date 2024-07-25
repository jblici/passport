import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { Button } from "./button";

const ResumenPaquetes = ({ resultados, agregarPaquete }) => (
  <div className="bg-card rounded-lg shadow-lg col-span-1 md:col-span-2">
    <div className="p-4 sm:p-6 md:p-8 border-b">
      <h2 className="text-xl font-bold mb-2">Resumen de Paquetes</h2>
    </div>
    <div className="p-4 sm:p-6 md:p-8">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Cerro</TableHead>
            <TableHead>Hotel</TableHead>
            <TableHead>Habitacion</TableHead>
            <TableHead>Pax</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Desayuno</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resultados?.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.province.name}</TableCell>
              <TableCell>{r.hotel.name}</TableCell>
              <TableCell>{r.room.name}</TableCell>
              <TableCell>{r.persons}</TableCell>
              <TableCell>{`$ ${r.price}`}</TableCell>
              <TableCell>{r.breakfast ? "Incluido" : "No incluido"}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="w-full bg-blue-500 text-white hover:bg-blue-600"
                  onClick={() =>
                    agregarPaquete({
                      name: `${r.province.name} - ${r.hotel.name}`,
                      price: r.price,
                    })
                  }
                >
                  Agregar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);

export default ResumenPaquetes;
