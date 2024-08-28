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
import { Edit, Save, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useReactFlow, type Node } from "@xyflow/react";
import { equalObjects } from "@/lib/utils";
import ChoiceLabel from "@/components/ui/nodes/choice/ChoiceLabel";
import ChoiceImage from "@/components/ui/nodes/choice/ChoiceImage";
import ChoiceText from "@/components/ui/nodes/choice/ChoiceText";
import ChoiceOptions from "@/components/ui/nodes/choice/ChoiceOptions";
import ChoiceAudios from "@/components/ui/nodes/choice/ChoiceAudios";
import ChoiceAudiosFallback from "@/components/ui/nodes/choice/ChoiceAudiosFallback";

type EditChoiceDialogProps = {
  id: string;
  data: ChoiceNodeData;
};

function EditChoiceDialog({ id, data }: EditChoiceDialogProps) {
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [confirmUnsavedDialogOpen, setConfirmUnsavedDialogOpen] = useState(false);
  const { updateNodeData } = useReactFlow<Node<ChoiceNodeData>>();

  const imageObjectURL = useMemo(() => URL.createObjectURL(data.image), [data.image]);
  const audiosObjectURLs = useMemo(
    () => data.audio.map(a => URL.createObjectURL(a)),
    [data.audio]
  ) as [string, string, string];

  const handleSave = () => {
    const isImageUploaded = data.preview.image.size > 0;
    const isSomeAudioUploaded = data.preview.audio.some(a => a.size > 0);

    const oldData: Partial<ChoiceNodeData> = {
      label: data.label,
      text: data.text,
      options: data.options,
    };
    const newData: Partial<ChoiceNodeData> = {
      label: data.preview.label,
      text: data.preview.text,
      options: data.preview.options,
    };

    if (equalObjects(oldData, newData) && !isImageUploaded && !isSomeAudioUploaded)
      return;
    if (isImageUploaded)
      updateNodeData(id, {
        image: data.preview.image,
      });
    if (isSomeAudioUploaded)
      updateNodeData(id, {
        audio: data.preview.audio,
      });

    updateNodeData(id, {
      ...newData,
      preview: {
        ...data.preview,
        image: new File([], ""),
        audio: [new File([], ""), new File([], ""), new File([], "")],
      },
    });

    toast.success("Modifiche salvate", { duration: 3000 });
  };

  return (
    <AlertDialog
      open={alertDialogOpen}
      onOpenChange={open => {
        const isImageUploaded = data.preview.image.size > 0;
        const isSomeAudioUploaded = data.preview.audio.some(a => a.size > 0);

        setAlertDialogOpen(open);

        if (!open) {
          if (isImageUploaded) URL.revokeObjectURL(imageObjectURL);
          if (isSomeAudioUploaded) audiosObjectURLs.forEach(u => URL.revokeObjectURL(u));
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
            Modifica scelta
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription />

        <ChoiceLabel id={id} />

        <ChoiceImage
          id={id}
          image={imageObjectURL}
        />

        <ChoiceText id={id} />

        <ChoiceOptions id={id} />

        <ChoiceAudios id={id} />

        <ChoiceAudiosFallback
          id={id}
          audios={audiosObjectURLs}
        />

        <AlertDialogFooter>
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

          <AlertDialog
            open={confirmUnsavedDialogOpen}
            onOpenChange={setConfirmUnsavedDialogOpen}
          >
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

                    updateNodeData(id, ({ data }) => ({
                      ...data,
                      preview: {
                        label: data.label,
                        image: data.image,
                        text: data.text,
                        audio: data.audio,
                        options: data.options,
                      },
                    }));
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

          <Button
            onClick={() => {
              const isImageUploaded = data.preview.image.size > 0;
              const isSomeAudioUploaded = data.preview.audio.some(a => a.size > 0);

              if (
                !equalObjects(
                  { label: data.label, text: data.text, options: data.options },
                  {
                    label: data.preview.label,
                    text: data.preview.text,
                    options: data.preview.options,
                  }
                ) ||
                isImageUploaded ||
                isSomeAudioUploaded
              ) {
                // NOTE if there are unsaved changes, open confirm dialog
                setConfirmUnsavedDialogOpen(true);

                return;
              }

              setAlertDialogOpen(false);
            }}
          >
            <X
              size={16}
              className="mr-2"
            />
            Annulla
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default EditChoiceDialog;
