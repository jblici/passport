import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { CalendarDaysIcon } from "@/components/svg/svg";
import Navbar from "@/components/ui/navbar";

export default function Cotizador() {
  return (
    <div className="flex flex-col sm:flex-row">
      <Navbar />
      <div className="w-full mx-auto p-4 sm:p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-card rounded-lg shadow-lg">
          <div className="p-4 sm:p-6 md:p-8 border-b">
            <h1 className="text-2xl font-bold mb-2">Propuesta de Viaje</h1>
            <p className="text-muted-foreground">Crea tu presupuesto de viaje</p>
          </div>
          <div className="p-4 sm:p-6 md:p-8">
            <form className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Fecha de Inicio</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarDaysIcon className="h-4 w-4" />
                      <span>Seleccionar fecha</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Calendar />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">Fecha de Finalización</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarDaysIcon className="h-4 w-4" />
                      <span>Seleccionar fecha</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Calendar />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pax">Cantidad de personas</Label>
                <Input id="pax" type="number" />
              </div>
              <div className="space-y-2">
                <Label>Alquiler de Esquí</Label>
                <div className="flex items-center gap-2">
                  <Checkbox id="ski-rental" />
                  <Label htmlFor="ski-rental">Incluir</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Transporte</Label>
                <div className="flex items-center gap-2">
                  <Checkbox id="transportation" />
                  <Label htmlFor="transportation">Incluir</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Clases de Esquí</Label>
                <div className="flex items-center gap-2">
                  <Checkbox id="ski-lessons" />
                  <Label htmlFor="ski-lessons">Incluir</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Pases de Esquí</Label>
                <div className="flex items-center gap-2">
                  <Checkbox id="ski-passes" />
                  <Label htmlFor="ski-passes">Incluir</Label>
                </div>
              </div>
              <div className="col-span-1 sm:col-span-2 md:col-span-3">
                <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600">
                  Buscar
                </Button>
              </div>
            </form>
          </div>
        </div>
        <div className="bg-card rounded-lg shadow-lg">
          <div className="p-4 sm:p-6 md:p-8 border-b">
            <h2 className="text-xl font-bold mb-2">Resumen de Compra</h2>
          </div>
          <div className="p-4 sm:p-6 md:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <span>Alquiler de Esquí</span>
              <span>$500</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Transporte</span>
              <span>$800</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Clases de Esquí</span>
              <span>$600</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Pases de Esquí</span>
              <span>$600</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">$2,500</span>
              <Button type="submit" className="w-auto bg-blue-500 text-white hover:bg-blue-600">
                Reservar
              </Button>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg shadow-lg col-span-1 md:col-span-2">
          <div className="p-4 sm:p-6 md:p-8 border-b">
            <h2 className="text-xl font-bold mb-2">Resumen de Hoteles</h2>
          </div>
          <div className="p-4 sm:p-6 md:p-8">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha de Inicio</TableHead>
                  <TableHead>Fecha de Finalización</TableHead>
                  <TableHead>Número de Personas</TableHead>
                  <TableHead>Alquiler de Esquí</TableHead>
                  <TableHead>Transporte</TableHead>
                  <TableHead>Clases de Esquí</TableHead>
                  <TableHead>Pases de Esquí</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Agregar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>2023-03-01</TableCell>
                  <TableCell>2023-03-07</TableCell>
                  <TableCell>4</TableCell>
                  <TableCell>Sí</TableCell>
                  <TableCell>Sí</TableCell>
                  <TableCell>Sí</TableCell>
                  <TableCell>Sí</TableCell>
                  <TableCell>
                    <Input type="number" defaultValue={1} className="w-20 text-center" />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      className="w-full bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Agregar
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2023-04-15</TableCell>
                  <TableCell>2023-04-22</TableCell>
                  <TableCell>2</TableCell>
                  <TableCell>No</TableCell>
                  <TableCell>Sí</TableCell>
                  <TableCell>No</TableCell>
                  <TableCell>Sí</TableCell>
                  <TableCell>
                    <Input type="number" defaultValue={1} className="w-20 text-center" />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      className="w-full bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Agregar
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2023-12-20</TableCell>
                  <TableCell>2023-12-27</TableCell>
                  <TableCell>6</TableCell>
                  <TableCell>Sí</TableCell>
                  <TableCell>Sí</TableCell>
                  <TableCell>Sí</TableCell>
                  <TableCell>Sí</TableCell>
                  <TableCell>
                    <Input type="number" defaultValue={1} className="w-20 text-center" />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      className="w-full bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Agregar
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="bg-card rounded-lg shadow-lg col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
          <div>
            <div className="p-4 sm:p-6 md:p-8 border-b">
              <h2 className="text-xl font-bold mb-2">Rentals</h2>
            </div>
            <div className="p-4 sm:p-6 md:p-8">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Agregar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Ski Rental</TableCell>
                    <TableCell>$50</TableCell>
                    <TableCell>
                      <Input type="number" defaultValue={1} className="w-20 text-center" />
                    </TableCell>
                    <TableCell>$100</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        className="w-full bg-blue-500 text-white hover:bg-blue-600"
                      >
                        Agregar
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Snowboard Rental</TableCell>
                    <TableCell>$75</TableCell>
                    <TableCell>
                      <Input type="number" defaultValue={1} className="w-20 text-center" />
                    </TableCell>
                    <TableCell>$75</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        className="w-full bg-blue-500 text-white hover:bg-blue-600"
                      >
                        Agregar
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Helmet Rental</TableCell>
                    <TableCell>$20</TableCell>
                    <TableCell>
                      <Input type="number" defaultValue={1} className="w-20 text-center" />
                    </TableCell>
                    <TableCell>$40</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        className="w-full bg-blue-500 text-white hover:bg-blue-600"
                      >
                        Agregar
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          <div>
            <div className="p-4 sm:p-6 md:p-8 border-b">
              <h2 className="text-xl font-bold mb-2">Clases</h2>
            </div>
            <div className="p-4 sm:p-6 md:p-8">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Agregar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Ski Lessons</TableCell>
                    <TableCell>$100</TableCell>
                    <TableCell>
                      <Input type="number" defaultValue={1} className="w-20 text-center" />
                    </TableCell>
                    <TableCell>$200</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        className="w-full bg-blue-500 text-white hover:bg-blue-600"
                      >
                        Agregar
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Snowboard Lessons</TableCell>
                    <TableCell>$120</TableCell>
                    <TableCell>
                      <Input type="number" defaultValue={1} className="w-20 text-center" />
                    </TableCell>
                    <TableCell>$120</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        className="w-full bg-blue-500 text-white hover:bg-blue-600"
                      >
                        Agregar
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
