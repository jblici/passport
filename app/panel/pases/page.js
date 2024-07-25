import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/app/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/app/components/ui/table";
import Navbar from "@/app/components/ui/navbar";
import Link from "next/link";
import { PlusIcon } from "@/app/components/svg/svg";
import Acciones from "@/app/components/ui/acciones";
import ProtectedLayout from "@/app/lib/protectedroute";

const Pases = () => {
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
                    <CardTitle>Pases de ski</CardTitle>
                    <CardDescription>Maneja todos los pases de ski.</CardDescription>
                  </div>
                  <Link
                    href="/pases/nuevo"
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
                        <TableHead>Tipo</TableHead>
                        <TableHead>Temporada</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Dias</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <div className="font-medium">Standard</div>
                        </TableCell>
                        <TableCell>
                          <div>Alta</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">$150.000</div>
                        </TableCell>
                        <TableCell>
                          <div>7</div>
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

export default Pases;