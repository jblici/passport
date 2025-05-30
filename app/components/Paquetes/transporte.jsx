import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { useState } from "react";

const PaquetesTransporte = ({ resultados, agregarPaquete }) => {
  const [selectedCounts, setSelectedCounts] = useState({});

  //console.log(resultados);

  if (!resultados) return null;
  if (Object.keys(resultados).length === 0) {
    return (
      <div className="bg-card rounded-lg shadow-lg col-span-1 md:col-span-2">
        <div className="p-4 sm:p-6 md:p-8 border-b">
          <h2 className="text-xl font-bold mb-2">No hay transporte disponible...</h2>
        </div>
      </div>
    );
  }

  const handleCountChange = (index, value) => {
    setSelectedCounts((prev) => ({
      ...prev,
      [index]: value,
    }));
  };
  if (!resultados.ida) {
    return (
      <div className="bg-card rounded-lg shadow-lg col-span-1 md:col-span-2">
        <div className="p-4 sm:p-6 md:p-8 border-b">
          <h2 className="text-xl font-bold mb-2">Transporte</h2>
        </div>
        <div className="p-4 sm:p-6 md:p-8">
          <h3 className="text-lg font-bold mb-2">Ida y Vuelta</h3>
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Cerro</TableHead>
                <TableHead>Servicio</TableHead>
                <TableHead>Origen</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Tramo</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Pax</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Cantidad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resultados?.map((r, index) => (
                <TableRow key={Math.floor(Math.random() * 1000000)}>
                  <TableCell>{r.cerro}</TableCell>
                  <TableCell>{r.servicio}</TableCell>
                  <TableCell>{r.origen}</TableCell>
                  <TableCell>{r.destino}</TableCell>
                  <TableCell>{r.tramo}</TableCell>
                  <TableCell>{r.descripcion.toLowerCase()}</TableCell>
                  <TableCell>{r.personas}</TableCell>
                  <TableCell>{`$ ${r.precio}`}</TableCell>
                  <TableCell>
                    <div className="flex">
                      <select
                        value={selectedCounts[index] || 1} // Valor por defecto
                        onChange={(e) => handleCountChange(index, e.target.value)}
                        className="mr-2"
                      >
                        {[...Array(5).keys()].map((num) => (
                          <option key={num + 1} value={num + 1}>
                            {num + 1}
                          </option>
                        ))}
                      </select>
                      <Button
                        variant="outline"
                        className="w-full bg-blue-500 text-white hover:bg-blue-600"
                        onClick={() => {
                          const count = selectedCounts[index] || 1; // Usar el valor seleccionado o 2 por defecto
                          agregarPaquete({
                            seccion: "transporte",
                            fechaInicio: r.inicio,
                            fechaFin: r.fin,
                            name: `${r.descripcion} - ${r.origen} / ${r.destino} ${
                              r.personas > 1
                                ? ` - ${r.personas} PAX ${count > 1 ? `x ${count}` : ""}`
                                : count > 1
                                ? `x ${count}`
                                : ""
                            }`,
                            price: r.precio * count,
                          });
                        }}
                      >
                        Agregar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  } else {
    return (
      <div className="bg-card rounded-lg shadow-lg col-span-1 md:col-span-2">
        <div className="p-4 sm:p-6 md:p-8 border-b">
          <h2 className="text-xl font-bold mb-2">Transporte</h2>
        </div>
        <div className="p-4 sm:p-6 md:p-8">
          {Object.keys(resultados).map((clave) => {
            const paquetes = resultados[clave];
            return (
              <div key={clave} className="p-4 sm:p-6 md:p-8">
                <h3 className="text-lg font-bold mb-2 capitalize">{clave === "idayvuelta" ? "Ida y Vuelta" : clave}</h3>
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cerro</TableHead>
                      <TableHead>Servicio</TableHead>
                      <TableHead>Origen</TableHead>
                      <TableHead>Destino</TableHead>
                      <TableHead>Descripcion</TableHead>
                      <TableHead>Pax</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Cantidad</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paquetes?.map((r, index) => (
                      <TableRow key={Math.floor(Math.random() * 1000000)}>
                        <TableCell>{r.cerro}</TableCell>
                        <TableCell>{r.servicio}</TableCell>
                        <TableCell>{r.origen}</TableCell>
                        <TableCell>{r.destino}</TableCell>
                        <TableCell>{r.descripcion.toLowerCase()}</TableCell>
                        <TableCell>{r.personas}</TableCell>
                        <TableCell>{`$ ${r.precio}`}</TableCell>
                        <TableCell>
                          <div className="flex">
                            <select
                              value={selectedCounts[index] || 1} // Valor por defecto
                              onChange={(e) => handleCountChange(index, e.target.value)}
                              className="mr-2"
                            >
                              {[...Array(5).keys()].map((num) => (
                                <option key={num + 1} value={num + 1}>
                                  {num + 1}
                                </option>
                              ))}
                            </select>
                            <Button
                              variant="outline"
                              className="w-full bg-blue-500 text-white hover:bg-blue-600"
                              onClick={() => {
                                const count = selectedCounts[index] || 1; // Usar el valor seleccionado o 2 por defecto
                                agregarPaquete({
                                  seccion: "transporte",
                                  fechaInicio: r.inicio,
                                  clave: clave,
                                  fechaFin: r.fin,
                                  name: `${r.descripcion} - ${r.origen} / ${r.destino}${
                                    r.personas > 1
                                      ? ` - ${r.personas} PAX${count > 1 ? ` x ${count}` : ""}`
                                      : count > 1
                                      ? ` x ${count}`
                                      : ""
                                  }`,
                                  price: r.precio * count,
                                });
                              }}
                            >
                              Agregar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
};

export default PaquetesTransporte;
