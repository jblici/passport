"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/app/components/ui/card";
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
import useFetch from "@/app/lib/hooks/useFetch";

const Centros = () => {
  const { centros } = useFetch();

  if (!centros) return null;
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
                    <CardTitle>Centros</CardTitle>
                    <CardDescription>Administra los centros.</CardDescription>
                  </div>
                  <Link
                    href="/centro/nuevo"
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
                      <TableRow className="border-black">
                        <TableHead className="font-bold">Nombre</TableHead>
                        <TableHead className="text-right font-bold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {centros.map((centro) => (
                        <TableRow key={centro.id}>
                          <TableCell>
                            <div className="font-medium">{centro.name}</div>
                          </TableCell>
                          <Acciones />
                        </TableRow>
                      ))}
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

export default Centros;
