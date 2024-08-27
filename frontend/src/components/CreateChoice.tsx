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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import useNodeUtils from "@/hooks/useNodeUtils";

function CreateChoice() {
  const [open, setOpen] = useState(false);
  const labelRef = useRef<HTMLInputElement | null>(null);
  const { onNodeCreate } = useNodeUtils();

  const handleCreate = () => {
    if (!labelRef.current) return;

    const value = labelRef.current.value;

    if (!value) {
      toast.error("Nome non valido");
      return;
    }

    onNodeCreate({ label: value, type: "choice" });
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
          <span className="mr-2 nodrag nopan text-md">&#63;</span> Crea scelta
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
          <AlertDialogTitle>Creazione scelta</AlertDialogTitle>
          <AlertDialogDescription />
        </AlertDialogHeader>

        <Input
          id="choice-name"
          ref={labelRef}
          className="w-full"
          placeholder="Nome..."
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

export default CreateChoice;
