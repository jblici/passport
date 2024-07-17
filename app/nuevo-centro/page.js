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

const NuevoHotel = () => {
  return (
    <div className="flex min-h-screen">
      <Navbar />
      <div className="flex-1 p-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr] gap-8">
          <section className="col-span-1 md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Agrega un nuevo centro</CardTitle>
                <CardDescription>Llena el formulario para agregar el nuevo centro.</CardDescription>
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
  );
};

export default NuevoHotel;
