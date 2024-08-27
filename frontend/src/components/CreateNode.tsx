import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRef, useState } from "react";

import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import useNodeUtils from "@/hooks/useNodeUtils";

function CreateNode() {
  const leftPageNumberRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const { onNodeCreate, getNode } = useNodeUtils();

  const handleCreate = () => {
    if (!leftPageNumberRef.current) return;

    const value = leftPageNumberRef.current.value;
    const valueAsNumber = Number(value);

    if (!value || valueAsNumber < 0) {
      toast.error("Numero pagina non valido");

      leftPageNumberRef.current.value = "";

      return;
    }
    if (valueAsNumber % 2 === 0) {
      toast.error("La pagina sinistra può essere solo dispari");

      leftPageNumberRef.current.value = "";

      return;
    }

    const nodeWithSameIdExists = getNode(`${valueAsNumber - 1}`) !== undefined; // NOTE: leftPageNumber = id + 1 so ==> id = leftPageNumber - 1

    if (nodeWithSameIdExists) {
      toast.error("Pagina già esistente");

      leftPageNumberRef.current.value = "";

      return;
    }

    onNodeCreate({ id: valueAsNumber - 1, type: "doublePage" }); // NOTE: leftPageNumber = id + 1 so ==> id = leftPageNumber - 1
    setOpen(false);
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={open => {
        if (open) setOpen(open);
      }}
    >
      <AlertDialogTrigger asChild>
        <Button
          variant="secondary"
          className="flex justify-center items-center"
        >
          <BookOpen className="mr-2" />
          Crea pagine
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        onKeyDown={e => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleCreate();
          }
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Creazione pagine</AlertDialogTitle>
          <AlertDialogDescription />
        </AlertDialogHeader>

        <Input
          type="number"
          placeholder="Numero pagina sinistra"
          className="inline-flex w-1/2"
          ref={leftPageNumberRef}
          autoFocus={true}
        />

        <AlertDialogFooter>
          <AlertDialogAction
            onClick={handleCreate}
            className="bg-confirm text-primary-foreground hover:bg-confirm-foreground"
          >
            Crea
          </AlertDialogAction>
          <AlertDialogCancel
            className="bg-primary hover:bg-primary/90 text-secondary hover:text-secondary"
            onClick={() => {
              setOpen(false);
            }}
          >
            Annulla
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CreateNode;
