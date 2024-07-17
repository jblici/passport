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
import Navbar from "@/components/ui/navbar";
import Link from "next/link";
import { PlusIcon } from "@/components/svg/svg";

const Hoteles = () => {
  return (
    <div className="flex min-h-screen">
      <Navbar />
      <div className="flex-1 p-8">
        <section className="col-span-1 md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle>Hoteles</CardTitle>
                  <CardDescription>Administra todos los hoteles.</CardDescription>
                </div>
                <Link
                  href="/nuevo-hotel"
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
                      <TableHead>Name</TableHead>
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
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="icon" variant="outline">
                            <FilePenIcon className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button size="icon" variant="outline">
                            <TrashIcon className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
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

export default Hoteles;
