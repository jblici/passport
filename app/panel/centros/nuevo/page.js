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
                  <CardTitle>Agrega un nuevo centro</CardTitle>
                  <CardDescription>
                    Llena el formulario para agregar el nuevo centro.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nombre</Label>
                      <Input id="name" placeholder="Enter hotel name" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="location">Ubicacion</Label>
                      <Input id="location" placeholder="Enter hotel location" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="rooms">Hoteles</Label>
                      <Input id="rooms" type="number" placeholder="Enter number of rooms" />
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
