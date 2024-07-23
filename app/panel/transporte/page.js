import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Link from "next/link";
import { PlusIcon } from "@/components/svg/svg";
import Navbar from "@/components/ui/navbar";
import Acciones from "@/components/ui/acciones";
import ProtectedLayout from "@/components/protectedroute";

const Transporte = () => {
  return (
    <ProtectedLayout>
      <div className="flex flex-col sm:flex-row">
        <Navbar />
        <div className="flex-1 p-4 sm:p-8">
          <section className="col-span-1 md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle>Transportes</CardTitle>
                    <CardDescription>Administra todos los transportes.</CardDescription>
                  </div>
                  <Link
                    href="/transporte/nuevo"
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
                        <TableHead>Precio</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <div className="font-medium">Catedral Ride</div>
                        </TableCell>
                        <TableCell>
                          <div>$5.000</div>
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
    </ProtectedLayout>
  );
};

export default Transporte;
