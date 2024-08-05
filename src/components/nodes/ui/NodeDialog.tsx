import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useReactFlow, type Node } from "@xyflow/react";

type NodeDialogProps = { id: string; pageNumber: number };

function NodeDialog({ id, pageNumber }: NodeDialogProps) {
  const [content, setContent] = useState("");
  const { getNode } = useReactFlow<Node<DoublePageNodeData>>();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Pagina {pageNumber}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Contenuto pagina {pageNumber}</DialogTitle>
        <DialogHeader>
          <DialogDescription>
            <Textarea
              placeholder="C'era una volta..."
              className="max-h-[200px]"
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                const nodeToUpdate = getNode(id);

                if (!nodeToUpdate) return;

                const nodeIndexToUpdate = pageNumber % 2 === 0 ? 1 : 0;
                const nodePages = nodeToUpdate.data.pages;

                nodePages[nodeIndexToUpdate].content = content;
              }}
            >
              Salva
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default NodeDialog;
