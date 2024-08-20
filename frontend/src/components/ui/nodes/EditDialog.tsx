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
import PageMedia from "@/components/ui/nodes/PageMedia";
import PageTextContents from "@/components/ui/nodes/PageTextContents";
import PageTextPositions from "@/components//ui/nodes/PageTextPositions";
import PreviewDialog from "@/components/ui/nodes/PreviewDialog";
import toast from "react-hot-toast";
import useNodeUtils from "@/hooks/useNodeUtils";
import { useState } from "react";
import useUploadMedia from "@/hooks/useUploadMedia";

type EditNodeDialogProps = {
  id: string;
  media: {
    backgroundImage: string;
    audio: string;
  };
};

function EditDialog({ id, media }: EditNodeDialogProps) {
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const { getNodeData, updateNodeData, isNodeDataEqual } = useNodeUtils();
  const data = getNodeData(id);
  const { uploadBackgroundImageMutation, uploadAudioMutation } = useUploadMedia(id, {
    backgroundImage: data.preview.backgroundImage,
    audio: data.preview.audio,
  });
  const backgroundImageObjectURL = URL.createObjectURL(data.preview.backgroundImage);
  const audioObjectURL = URL.createObjectURL(data.preview.audio);

  return (
    <AlertDialog
      open={alertDialogOpen}
      onOpenChange={open => {
        setAlertDialogOpen(open);

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

        <PageMedia
          id={id}
          media={media}
        />

        <AlertDialogFooter>
          <AlertDialogAction
            className="bg-green-500 text-primary-foreground hover:bg-green-400 flex justify-center items-center"
            onClick={() => {
              if (
                isNodeDataEqual(data, {
                  label: data.preview.label,
                  leftPageNumber: data.preview.leftPageNumber,
                  rightPageNumber: data.preview.rightPageNumber,
                  pages: data.preview.pages,
                  deletable: data.preview.deletable,
                }) &&
                data.preview.backgroundImage.size <= 0 &&
                data.preview.audio.size <= 0
              )
                return;

              if (data.preview.backgroundImage) {
                uploadBackgroundImageMutation.mutate();
              }
              if (data.preview.audio) {
                uploadAudioMutation.mutate();
              }

              updateNodeData(id, {
                ...data.preview,
                preview: data.preview,
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
            id={id}
            data={data.preview}
            media={{
              backgroundImage: data.preview.backgroundImage.size
                ? backgroundImageObjectURL
                : media.backgroundImage,
              audio: data.preview.audio.size ? audioObjectURL : media.audio,
            }}
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

          {!isNodeDataEqual(data, {
            label: data.preview.label,
            leftPageNumber: data.preview.leftPageNumber,
            rightPageNumber: data.preview.rightPageNumber,
            pages: data.preview.pages,
            deletable: data.preview.deletable,
          }) ||
          data.preview.backgroundImage.size > 0 ||
          data.preview.audio.size > 0 ? (
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
                          label: data.label,
                          leftPageNumber: data.leftPageNumber,
                          rightPageNumber: data.rightPageNumber,
                          backgroundImage: new File([], ""),
                          pages: data.pages,
                          audio: new File([], ""),
                          deletable: data.deletable,
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
