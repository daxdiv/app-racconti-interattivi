import { SquareArrowOutUpRight, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import type { Data } from "@/hooks/useUser";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "@/lib/utils";
import { truncate } from "@/lib/utils";

type FlowsTableProps = {
  data: Data;
  isLoading: boolean;
};

function FlowsTable(user: FlowsTableProps) {
  return (
    <ScrollArea className="h-[500px]">
      <Table>
        <TableCaption />
        <TableHeader>
          <TableRow>
            <TableHead
              className="w-[150px]"
              colSpan={2}
            >
              Titolo
            </TableHead>
            <TableHead className="text-center w-[400px]">
              Numero di nodi{" "}
              <span className="text-xs text-muted-foreground">(numero di pagine)</span>
            </TableHead>
            <TableHead className="text-center">Creato il</TableHead>
            <TableHead
              colSpan={2}
              className="text-right w-[300px]"
            >
              Azioni
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {user.data.flows.map(f => (
            <TableRow key={f._id}>
              <TableCell
                className="font-medium"
                colSpan={2}
              >
                {truncate(f.label, 20)}
              </TableCell>
              <TableCell className="text-center">
                {f.nodesLength}{" "}
                <span className="text-xs text-muted-foreground">
                  ({f.nodesLength * 2})
                </span>
              </TableCell>
              <TableCell className="text-center">
                {formatDate(new Date(f.createdAt))}
              </TableCell>
              <TableCell
                colSpan={2}
                className="text-right flex justify-end items-center gap-x-1"
              >
                <Button
                  type="button"
                  className="flex justify-start items-center gap-x-1 text-xs"
                >
                  <SquareArrowOutUpRight size={15} />
                  Modifica
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  className="flex justify-center items-center gap-x-1 text-xs"
                >
                  <Trash size={15} />
                  Elimina
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter />
      </Table>
    </ScrollArea>
  );
}

export default FlowsTable;
