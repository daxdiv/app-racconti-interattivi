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
import { Tooltip, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import PageMultimedia from "@/components/ui/nodes/PageMultimedia";
import PageTextContents from "@/components/ui/nodes/PageTextContents";
import PageTextPositions from "@/components//ui/nodes/PageTextPositions";
import PreviewDialog from "@/components/ui/nodes/PreviewDialog";
import { TOOLTIP_DELAY_DURATION } from "@/constants";
import useNodeReducer from "@/hooks/useNodeReducer";
import useNodeUtils from "@/hooks/useNodeUtils";
import { useState } from "react";

type EditNodeDialogProps = {
  id: string;
  data: DoublePageNodeData;
};

function EditDialog({ id, data }: EditNodeDialogProps) {
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const { saveChanges } = useNodeUtils();
  const [nodeChanges, dispatch] = useNodeReducer(id);

  return (
    <AlertDialog
      open={alertDialogOpen}
      onOpenChange={open => {
        dispatch({ payload: data, type: "UPDATE_ALL" });
        setAlertDialogOpen(open);
      }}
    >
      <AlertDialogTrigger asChild>
        <Button
          className="w-full"
          variant="outline"
        >
          <Edit
            className="mr-2"
            size={16}
          />{" "}
          Modifica
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        className="max-w-3xl w-full"
        onEscapeKeyDown={e => {
          e.preventDefault();
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="flex justify-start items-center gap-2">
            Modifica pagine {data.leftPageNumber}/{data.rightPageNumber}{" "}
            <TooltipProvider delayDuration={TOOLTIP_DELAY_DURATION}>
              <Tooltip>
                <PreviewDialog {...nodeChanges} />
                <TooltipContent>
                  Visualizza anteprima pagine {data.leftPageNumber}/{data.rightPageNumber}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription />

        <PageTextContents
          data={nodeChanges}
          dispatch={dispatch}
        />

        <PageTextPositions
          data={nodeChanges}
          dispatch={dispatch}
        />

        <PageMultimedia
          data={nodeChanges}
          prevData={data}
          dispatch={dispatch}
        />

        <AlertDialogFooter>
          <AlertDialogAction
            className="bg-green-500 text-primary-foreground hover:bg-green-400"
            onClick={() => {
              if (JSON.stringify(data) === JSON.stringify(nodeChanges)) return;

              saveChanges(id, nodeChanges);
            }}
          >
            Salva
          </AlertDialogAction>

          {JSON.stringify(data) !== JSON.stringify(nodeChanges) ? ( // compare object
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button">Annulla</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Hai effettuato delle modifiche, uscire senza salvare?
                  </AlertDialogTitle>
                  <AlertDialogDescription />
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction
                    className="bg-destructive hover:bg-destructive/70"
                    onClick={() => setAlertDialogOpen(false)}
                  >
                    Si
                  </AlertDialogAction>
                  <AlertDialogCancel className="bg-primary hover:bg-primary/90 text-secondary hover:text-secondary">
                    No
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <AlertDialogCancel className="bg-primary hover:bg-primary/90 text-secondary hover:text-secondary">
              Annulla
            </AlertDialogCancel>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default EditDialog;
