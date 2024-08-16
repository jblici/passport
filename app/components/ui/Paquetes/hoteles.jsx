import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table";
import { Button } from "../button";

const PaquetesHoteles = ({ resultados, agregarPaquete }) => {
  if (!resultados) return null;
  return (
    <div className="bg-card rounded-lg shadow-lg col-span-1 md:col-span-2">
      <div className="p-4 sm:p-6 md:p-8 border-b">
        <h2 className="text-xl font-bold mb-2">Paquetes</h2>
      </div>
      <div className="p-4 sm:p-6 md:p-8">
        {Object.keys(resultados).map((clave) => {
          const paquetes = resultados[clave];
          return (
          <div key={clave} className="mb-6">
            <h3 className="text-lg font-bold mb-2">{`Paquetes para ${clave.replace(
              "total_",
              ""
            )}`}</h3>
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Cerro</TableHead>
                  <TableHead>Hotel</TableHead>
                  <TableHead>Habitacion</TableHead>
                  <TableHead>Noches</TableHead>
                  <TableHead>Personas</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Agregar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paquetes.map((r) => 
                  !r.paquetesUtilizados.paquetes ? (
                    <TableRow key={r.id + r.total + r.paquetesUtilizados.habitacion + r.paquetesUtilizados.hotel}>
                      <TableCell>{r.paquetesUtilizados.cerro}</TableCell>
                      <TableCell>{r.paquetesUtilizados.hotel}</TableCell>
                      <TableCell>{r.paquetesUtilizados.habitacion}</TableCell>
                      <TableCell>{r.paquetesUtilizados.noches}</TableCell>
                      <TableCell>{r.personas}</TableCell>
                      <TableCell>{`$ ${r.precioPromedio}`}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          className="w-full bg-blue-500 text-white hover:bg-blue-600"
                          onClick={() =>
                            agregarPaquete({
                              name: `${r.paquetesUtilizados.hotel} - ${r.paquetesUtilizados.habitacion}`,
                              price: r.total,
                            })
                          }
                        >
                          Agregar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow key={r.id + r.total + r.paquetesUtilizados.paquetes[0].habitacion + r.paquetesUtilizados.paquetes[0].hotel}>
                      <TableCell>{r.paquetesUtilizados.paquetes[0].cerro}</TableCell>
                      <TableCell>{r.paquetesUtilizados.paquetes[0].hotel}</TableCell>
                      <TableCell>{r.paquetesUtilizados.paquetes[0].habitacion}</TableCell>
                      <TableCell>
                        {r.paquetesUtilizados.paquetes[0].noches +
                          r.paquetesUtilizados.paquetes[1].noches}
                      </TableCell>
                      <TableCell>{r.personas}</TableCell>
                      <TableCell>{`$ ${r.precioPromedio}`}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          className="w-full bg-blue-500 text-white hover:bg-blue-600"
                          onClick={() =>
                            agregarPaquete({
                              name: `${r.paquetesUtilizados.paquetes[0].hotel} - ${r.paquetesUtilizados.paquetes[0].habitacion}`,
                              price: r.total,
                            })
                          }
                        >
                          Agregar
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        )
        })}
      </div>
    </div>
  );
};

export default PaquetesHoteles;
