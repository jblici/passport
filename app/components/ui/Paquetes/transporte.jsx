import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table";
import { Button } from "../button";

const PaquetesTransporte = ({ resultados, agregarPaquete }) => {
  const [selectedCounts, setSelectedCounts] = useState({});
 
  //console.log(resultados);
  if (!resultados) return null;
  if (Object.keys(resultados).length === 0) {
    return (
      <div className="bg-card rounded-lg shadow-lg col-span-1 md:col-span-2">
        <div className="p-4 sm:p-6 md:p-8 border-b">
          <h2 className="text-xl font-bold mb-2">No hay Clases disponibles...</h2>
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

  return (
    <div className="bg-card rounded-lg shadow-lg col-span-1 md:col-span-2">
      <div className="p-4 sm:p-6 md:p-8 border-b">
        <h2 className="text-xl font-bold mb-2">Transporte</h2>
      </div>
      <div className="p-4 sm:p-6 md:p-8">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Cerro</TableHead>
              <TableHead>Recorrido</TableHead>
              <TableHead>Servicio</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Pasajeros</TableHead>
              <TableHead>Agregar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resultados?.map((r) => (
              <TableRow key={Math.floor(Math.random() * 1000000)}>
                <TableCell>{r.cerro}</TableCell>
                <TableCell>{r.recorrido}</TableCell>
                <TableCell>{r.servicio}</TableCell>
                <TableCell>{`$ ${r.precio}`}</TableCell>
                <TableCell>{r.personas}</TableCell>
               
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
                          name: `Traslado ${r.recorrido} - ${r.servicio} - x ${count}`,
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
};

export default PaquetesTransporte;
