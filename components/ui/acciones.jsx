import React from "react";
import { TableCell } from "@/components/ui/table";
import { FilePenIcon, TrashIcon } from "@/components/svg/svg";
import { Button } from "./button";

const Acciones = () => {
  return (
    <TableCell className="text-right">
      <div className="flex justify-end gap-2">
        <Button size="icon" variant="outline">
          <FilePenIcon className="h-4 w-4" />
          <span className="sr-only">Editar</span>
        </Button>
        <Button size="icon" variant="outline">
          <TrashIcon className="h-4 w-4" />
          <span className="sr-only">Borrar</span>
        </Button>
      </div>
    </TableCell>
  );
};

export default Acciones;
