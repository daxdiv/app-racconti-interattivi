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
import { Edit, Eye, Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import PageMultimedia from "@/components/ui/nodes/PageMultimedia";
import PageTextContents from "@/components/ui/nodes/PageTextContents";
import PageTextPositions from "@/components//ui/nodes/PageTextPositions";
import PreviewDialog from "@/components/ui/nodes/PreviewDialog";
import toast from "react-hot-toast";
import useNodeUtils from "@/hooks/useNodeUtils";
import { useState } from "react";

type EditNodeDialogProps = {
  id: string;
};

function EditDialog({ id }: EditNodeDialogProps) {
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const { getNodeData, updateNodeData, isNodeDataEqual } = useNodeUtils();
  const data = getNodeData(id);

  return (
    <AlertDialog
      open={alertDialogOpen}
      onOpenChange={setAlertDialogOpen}
    >
      <AlertDialogTrigger asChild>
        <Button
          className="w-1/2"
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
          <AlertDialogTitle className="flex justify-start items-center">
            Modifica pagine {data.leftPageNumber}/{data.rightPageNumber}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription />

        <PageTextContents id={id} />

        <PageTextPositions id={id} />

        <PageMultimedia id={id} />

        <AlertDialogFooter>
          <AlertDialogAction
            className="bg-green-500 text-primary-foreground hover:bg-green-400 flex justify-center items-center"
            onClick={() => {
              if (isNodeDataEqual(data, data.preview)) return;

              updateNodeData(id, {
                ...data.preview,
                preview: data.preview,
                deletable: true,
              });
              toast.success("Modifiche salvate", { duration: 3000 });
            }}
          >
            <Save
              size={16}
              className="mr-2"
            />
            Salva
          </AlertDialogAction>

          <PreviewDialog
            data={data.preview}
            trigger={
              <Button>
                <Eye
                  className="mr-2"
                  size={16}
                />{" "}
                Anteprima
              </Button>
            }
          />

          {!isNodeDataEqual(data, data.preview) ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  className="flex justify-center items-center"
                >
                  <X
                    size={16}
                    className="mr-2"
                  />
                  Annulla
                </Button>
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
                    onClick={() => {
                      setAlertDialogOpen(false);

                      // NOTE: workaround to reset the node data
                      updateNodeData(id, {
                        preview: {
                          audio: data.audio,
                          backgroundImage: data.backgroundImage,
                          leftPageNumber: data.leftPageNumber,
                          rightPageNumber: data.rightPageNumber,
                          label: data.label,
                          pages: data.pages,
                        },
                      });
                    }}
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
              <X
                size={16}
                className="mr-2"
              />
              Annulla
            </AlertDialogCancel>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default EditDialog;
