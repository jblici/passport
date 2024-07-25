import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/app/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/app/components/ui/select";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import Navbar from "@/app/components/ui/navbar";
import ProtectedLayout from "@/app/lib/protectedroute";

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
                  <CardTitle>Agrega un nuevo transporte</CardTitle>
                  <CardDescription>
                    Llena el formulario para agregar el nuevo transporte.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nombre</Label>
                      <Input id="name" placeholder="Enter hotel name" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="location">Centro</Label>
                      <Input id="location" placeholder="Enter hotel location" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="rating">Rating</Label>
                      <Select id="rating" defaultValue="5">
                        <SelectTrigger>
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 stars</SelectItem>
                          <SelectItem value="4">4 stars</SelectItem>
                          <SelectItem value="3">3 stars</SelectItem>
                          <SelectItem value="2">2 stars</SelectItem>
                          <SelectItem value="1">1 star</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="rooms">Habitaciones</Label>
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