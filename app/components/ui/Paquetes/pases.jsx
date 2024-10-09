import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table";
import { Button } from "../button";

const PaquetesPases = ({ resultados, agregarPaquete }) => {
  //console.log(resultados)
  if (!resultados) return null;
  return (
    <div className="bg-card rounded-lg shadow-lg col-span-1 md:col-span-2">
      <div className="p-4 sm:p-6 md:p-8 border-b">
        <h2 className="text-xl font-bold mb-2">Pases</h2>
      </div>
      <div className="p-4 sm:p-6 md:p-8">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Cerro</TableHead>
              <TableHead>Fecha Inicio</TableHead>
              <TableHead>Fecha Final</TableHead>
              <TableHead>Temporada</TableHead>
              <TableHead>Días</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Agregar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resultados?.map((r) => (
              <TableRow key={Math.floor(Math.random() * 1000000)}>
                <TableCell>{r.cerro}</TableCell>
                <TableCell>{r.fechaInicio}</TableCell>
                <TableCell>{r.fechaFinal}</TableCell>
                <TableCell>{r.temporada}</TableCell>
                <TableCell>{r.dias}</TableCell>
                <TableCell>{r.categoria}</TableCell>
                <TableCell>{r.tipo}</TableCell>
                <TableCell>{`$ ${r.precio}`}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    className="w-full bg-blue-500 text-white hover:bg-blue-600"
                    onClick={() =>
                      agregarPaquete({
                        name: `Pase ${r.cerro} - ${r.temporada}`,
                        price: r.precio,
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

export default PaquetesPases;
