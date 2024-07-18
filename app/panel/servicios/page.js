import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { FilePenIcon, TrashIcon } from "@/lib/utils";
import Link from "next/link";
import { PlusIcon } from "@/components/svg/svg";
import Navbar from "@/components/ui/navbar";
import Acciones from "@/components/ui/acciones";

const Servicios = () => {
  return (
    <div className="flex flex-col sm:flex-row">
      <Navbar />
      <div className="flex-1 p-4 sm:p-8">
        <section className="col-span-1 md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle>Servicios</CardTitle>
                  <CardDescription>Administra todos los servicios</CardDescription>
                </div>
                <Link
                  href="/nuevo-servicio"
                  className="bg-blue-500 hover:bg-blue-600 text-primary-foreground rounded-full p-3"
                >
                  <PlusIcon />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative w-full overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Rooms</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Luxury Resort</div>
                      </TableCell>
                      <TableCell>
                        <div>Aspen, Colorado</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">{/* Rating */}</div>
                      </TableCell>
                      <TableCell>
                        <div>125</div>
                      </TableCell>
                      <Acciones />
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Servicios;
