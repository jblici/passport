import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table";
import { Button } from "../button";

const PaquetesEquipos = ({ resultados, agregarPaquete }) => {
  //console.log(resultados)
  if (!resultados) return null;
  if (Object.keys(resultados).length === 0) {
    return (
      <div className="bg-card rounded-lg shadow-lg col-span-1 md:col-span-2">
        <div className="p-4 sm:p-6 md:p-8 border-b">
          <h2 className="text-xl font-bold mb-2">No hay Equipos disponibles...</h2>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-card rounded-lg shadow-lg col-span-1 md:col-span-2">
      <div className="p-4 sm:p-6 md:p-8 border-b">
        <h2 className="text-xl font-bold mb-2">Rentals</h2>
      </div>
      <div className="p-4 sm:p-6 md:p-8">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Cerro</TableHead>
              <TableHead>Temporada</TableHead>
              <TableHead>Gama</TableHead>
              <TableHead>Articulo</TableHead>
              <TableHead>Dias</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Agregar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resultados?.map((r, index) => (
              <TableRow key={index}>
                <TableCell>{r.cerro}</TableCell>
                <TableCell>{r.temporada}</TableCell>
                <TableCell>{r.gama}</TableCell>
                <TableCell>{r.articulo}</TableCell>
                <TableCell>{r.dias}</TableCell>
                <TableCell>{`$ ${r.precio}`}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    className="w-full bg-blue-500 text-white hover:bg-blue-600"
                    onClick={() =>
                      agregarPaquete({
                        name: `${r.articulo} - ${r.gama}`,
                        price: r.precio * r.dias,
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
};

export default PaquetesEquipos;
