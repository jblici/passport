import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/ui/navbar";
import withAuth from "@/lib/withAuth";

const NuevoHotel = () => {
  return (
    <div className="flex flex-col sm:flex-row">
      <Navbar />
      <div className="flex-1 p-4 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr] gap-8">
          <section className="col-span-1 md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Agrega una nueva habitacion</CardTitle>
                <CardDescription>
                  Llena el formulario para agregar la nueva habitacion.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input id="nombre" placeholder="Indique nombre de habitacion" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="pax">Cantidad de personas</Label>
                    <Input id="pax" type="number" placeholder="Indique cantidad de personas" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="precio">Precio</Label>
                    <Input id="precio" type="number" placeholder="Indique precio de habitacion" />
                  </div>
                  <Select id="desayuno" defaultValue="1">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccion si tiene desayuno incluido" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Si</SelectItem>
                        <SelectItem value="2">No</SelectItem>
                      </SelectContent>
                    </Select>
                  <div className="grid gap-2">
                    <Label htmlFor="noches">Minimo de noches</Label>
                    <Input id="noches" type="number" placeholder="Indique minimo de noches" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="moneda">Moneda</Label>
                    <Input id="moneda" placeholder="Indique la moneda" />
                  </div>
                  <Button type="submit" className="justify-self-end">
                    Guardar
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
};

export default withAuth(NuevoHotel);
