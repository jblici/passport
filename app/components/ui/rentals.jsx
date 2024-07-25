import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { Input } from "./input";
import { Button } from "./button";

const Rentals = () => {
  return (
    <div className="bg-card rounded-lg shadow-lg col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
      <div>
        <div className="p-4 sm:p-6 md:p-8 border-b">
          <h2 className="text-xl font-bold mb-2">Rentals</h2>
        </div>
        <div className="p-4 sm:p-6 md:p-8">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Agregar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Ski Rental</TableCell>
                <TableCell>$50</TableCell>
                <TableCell>
                  <Input type="number" defaultValue={1} className="w-20 text-center" />
                </TableCell>
                <TableCell>$100</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    className="w-full bg-blue-500 text-white hover:bg-blue-600"
                  >
                    Agregar
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Snowboard Rental</TableCell>
                <TableCell>$75</TableCell>
                <TableCell>
                  <Input type="number" defaultValue={1} className="w-20 text-center" />
                </TableCell>
                <TableCell>$75</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    className="w-full bg-blue-500 text-white hover:bg-blue-600"
                  >
                    Agregar
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Helmet Rental</TableCell>
                <TableCell>$20</TableCell>
                <TableCell>
                  <Input type="number" defaultValue={1} className="w-20 text-center" />
                </TableCell>
                <TableCell>$40</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    className="w-full bg-blue-500 text-white hover:bg-blue-600"
                  >
                    Agregar
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Rentals;
