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
import ProtectedLayout from "@/components/protectedroute";

const NuevoHotel = () => {
  return (
    <ProtectedLayout>
      <div className="flex flex-col sm:flex-row">
        <Navbar />
        <div className="flex-1 p-4 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-[1fr] gap-8">
            <section className="col-span-1 md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Agrega un nuevo pase</CardTitle>
                  <CardDescription>Llena el formulario para agregar el nuevo pase.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="tipo">Tipo</Label>
                      <Input id="tipo" placeholder="Indique tipo de pase" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="temporada">Temporada</Label>
                      <Select id="temporada" defaultValue="1">
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione Temporada" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">Baja</SelectItem>
                          <SelectItem value="2">Media</SelectItem>
                          <SelectItem value="1">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="dias">Dias</Label>
                      <Input id="dias" type="number" placeholder="Indique cantidad de dias" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="precio">Precio</Label>
                      <Input id="precio" type="number" placeholder="Indique el precio" />
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
    </ProtectedLayout>
  );
};

export default NuevoHotel;
