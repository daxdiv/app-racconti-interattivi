import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download, Edit, Trash } from "lucide-react";
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
import { downloadFlow } from "@/api";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import { truncate } from "@/lib/utils";
import useFlow from "@/hooks/useFlow";
import { useNavigate } from "react-router-dom";

type FlowsTableProps = {
  data: Data;
  isLoading: boolean;
};

function FlowsTable(user: FlowsTableProps) {
  const navigate = useNavigate();
  const { deleteFlow } = useFlow();

  const handleDeleteFlow = (flowId: string) => {
    toast.promise(deleteFlow.mutateAsync(flowId), {
      loading: "Caricamento...",
      success: ({ message }) => message,
      error: ({ message }) => `Errore eliminazione racconto \n\t ${message}`,
    });
  };

  return (
    <ScrollArea className="h-[280px]">
      <Table>
        <TableCaption>Racconti totali: {user.data.flows.length}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead
              className="w-[150px] rounded-tl-md"
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
              className="text-center w-[300px] rounded-tr-md"
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
                className="text-right flex justify-center items-center gap-x-1"
              >
                <Button
                  type="button"
                  className="flex justify-start items-center gap-x-1 text-xs"
                  onClick={() => {
                    navigate(`/flow/${f._id}`);
                  }}
                >
                  <Edit size={15} />
                  Modifica
                </Button>

                <Button
                  type="button"
                  className="flex justify-start items-center gap-x-1 text-xs"
                  onClick={() => downloadFlow(f._id)}
                >
                  <Download size={15} />
                  Scarica <code className="text-xs text-muted-foreground">(.zip)</code>
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      className="flex justify-center items-center gap-x-1 text-xs"
                      disabled={deleteFlow.isPending}
                    >
                      <Trash size={15} />
                      Elimina
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Sei sicuro di voler eliminare questo racconto?
                      </DialogTitle>
                      <DialogDescription>Questa azione è irreversibile</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => handleDeleteFlow(f._id)}
                        >
                          Si
                        </Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button type="button">No</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
