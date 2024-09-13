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
import PageMedia from "@/components/ui/nodes/doublePage/PageMedia";
import PageTextContents from "@/components/ui/nodes/doublePage/PageTextContents";
import PageTextPositions from "@/components/ui/nodes/doublePage/PageTextPositions";
import PreviewDialog from "@/components/ui/nodes/doublePage/PreviewDialog";
import toast from "react-hot-toast";
import useDoublePageDownload from "@/hooks/nodes/doublePage/useDoublePageDownload";
import useNodeUtils from "@/hooks/useNodeUtils";
import { useState } from "react";
import useDoublePageUpload from "@/hooks/nodes/doublePage/useDoublePageUpload";
import { useReactFlow, type Node } from "@xyflow/react";
import { equalObjects } from "@/lib/utils";

type EditNodeDialogProps = {
  id: string;
};

function EditDialog({ id }: EditNodeDialogProps) {
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const { getNodeData } = useNodeUtils();
  const { updateNodeData } = useReactFlow<Node<DoublePageNodeData>>();
  const data = getNodeData(id) as DoublePageNodeData;
  const { backgroundImageQuery, audioQuery } = useDoublePageDownload(id);
  const { uploadBackgroundImageMutation, uploadAudioMutation } = useDoublePageUpload(id, {
    backgroundImage: data.preview.backgroundImage,
    audio: data.preview.audio,
  });
  const backgroundImageObjectURL = URL.createObjectURL(data.preview.backgroundImage);
  const audioObjectURL = URL.createObjectURL(data.preview.audio);

  const handleSave = () => {
    const isImageUploaded = data.preview.backgroundImage.size > 0;
    const isAudioUploaded = data.preview.audio.size > 0;

    const oldData: Partial<DoublePageNodeData> = {
      label: data.label,
      leftPageNumber: data.leftPageNumber,
      rightPageNumber: data.rightPageNumber,
      pages: data.pages,
    };
    const newData: Partial<DoublePageNodeData> = {
      label: data.preview.label,
      leftPageNumber: data.preview.leftPageNumber,
      rightPageNumber: data.preview.rightPageNumber,
      pages: data.preview.pages,
    };

    if (equalObjects(oldData, newData) && !isImageUploaded && !isAudioUploaded) return;

    if (isImageUploaded) uploadBackgroundImageMutation.mutate();
    if (isAudioUploaded) uploadAudioMutation.mutate();

    updateNodeData(id, ({ data }) => ({
      ...data.preview,
      preview: data.preview,
    }));

    toast.success("Modifiche salvate", { duration: 3000 });
  };

  return (
    <AlertDialog
      open={alertDialogOpen}
      onOpenChange={open => {
        setAlertDialogOpen(open);

        if (open) {
          backgroundImageQuery.refetch();
          audioQuery.refetch();
        }
        if (!open) {
          URL.revokeObjectURL(backgroundImageObjectURL);
          URL.revokeObjectURL(audioObjectURL);
        }
      }}
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
        className="max-w-4xl w-full"
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

        <PageMedia
          id={id}
          media={{
            backgroundImage: backgroundImageQuery.data || "",
            audio: audioQuery.data || "",
          }}
        />

        <AlertDialogFooter className="mt-2 flex justify-between sm:justify-between items-center w-full">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive-outline">
                <X
                  size={16}
                  className="mr-2"
                />
                Annulla
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Uscire senza salvare?</AlertDialogTitle>
                <AlertDialogDescription>
                  Le modifiche non salvate andranno perse
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive/70"
                  onClick={() => {
                    setAlertDialogOpen(false);

                    updateNodeData(id, {
                      preview: {
                        label: data.label,
                        leftPageNumber: data.leftPageNumber,
                        rightPageNumber: data.rightPageNumber,
                        backgroundImage: new File([], ""),
                        pages: data.pages,
                        audio: new File([], ""),
                      },
                    });
                  }}
                >
                  Si
                </AlertDialogAction>
                <AlertDialogCancel asChild>
                  <Button
                    variant="outline"
                    className="border-primary"
                  >
                    No
                  </Button>
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <div className="flex justify-center items-center gap-x-2">
            <PreviewDialog
              id={id}
              data={data.preview}
              media={{
                backgroundImage:
                  data.preview.backgroundImage.size > 0
                    ? backgroundImageObjectURL
                    : backgroundImageQuery.data || "",
                audio:
                  data.preview.audio.size > 0 ? audioObjectURL : audioQuery.data || "",
              }}
              trigger={
                <Button
                  variant="outline"
                  className="border-primary"
                >
                  <Eye
                    className="mr-2"
                    size={16}
                  />{" "}
                  Anteprima
                </Button>
              }
            />

            <AlertDialogAction
              className="bg-confirm text-primary-foreground hover:bg-confirm-foreground flex justify-center items-center"
              onClick={handleSave}
            >
              <Save
                size={16}
                className="mr-2"
              />
              Salva
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default EditDialog;
