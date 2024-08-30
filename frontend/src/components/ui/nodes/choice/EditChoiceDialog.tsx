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
import PreviewChoiceDialog from "@/components/ui/nodes/choice/PreviewChoiceDialog";
import ChoiceFeedback from "@/components/ui/nodes/choice/ChoiceFeedback";

type EditChoiceDialogProps = {
  id: string;
  data: ChoiceNodeData;
};

function EditChoiceDialog({ id, data }: EditChoiceDialogProps) {
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const { updateNodeData } = useReactFlow<Node<ChoiceNodeData>>();

  const imageObjectURL = useMemo(() => URL.createObjectURL(data.image), [data.image]);
  const audiosObjectURLs = useMemo(
    () => data.audio.map(a => URL.createObjectURL(a)),
    [data.audio]
  ) as [string, string, string];
  const feedbackAudiosObjectURLs = useMemo(
    () => data.feedback.list.map(li => URL.createObjectURL(li.audio)),
    [data.feedback.list]
  ) as [string, string];

  const handleSave = () => {
    const isImageUploaded = data.preview.image.size > 0;
    const isSomeAudioUploaded = data.preview.audio.some(a => a.size > 0);
    const isSomeFeedbackAudioUploaded = data.preview.feedback.list.some(
      li => li.audio.size > 0
    );

    const oldData: Partial<ChoiceNodeData> = {
      label: data.label,
      text: data.text,
      options: data.options,
      feedback: data.feedback,
    };
    const newData: Partial<ChoiceNodeData> = {
      label: data.preview.label,
      text: data.preview.text,
      options: data.preview.options,
      feedback: data.preview.feedback,
    };

    if (
      equalObjects(oldData, newData) &&
      !isImageUploaded &&
      !isSomeAudioUploaded &&
      !isSomeFeedbackAudioUploaded
    )
      return;
    if (isImageUploaded)
      updateNodeData(id, {
        image: data.preview.image,
      });
    if (isSomeAudioUploaded)
      updateNodeData(id, {
        audio: data.preview.audio,
      });
    if (isSomeFeedbackAudioUploaded)
      updateNodeData(id, {
        feedback: {
          ...data.preview.feedback,
          list: data.preview.feedback.list,
        },
      });

    updateNodeData(id, {
      ...newData,
      preview: {
        ...data.preview,
        image: new File([], ""),
        audio: [new File([], ""), new File([], ""), new File([], "")],
        feedback: {
          ...data.preview.feedback,
          list: [
            {
              ...data.preview.feedback.list[0],
              audio: new File([], ""),
            },
            {
              ...data.preview.feedback.list[1],
              audio: new File([], ""),
            },
          ],
        },
      },
    });

    toast.success("Modifiche salvate", { duration: 3000 });
  };

  return (
    <AlertDialog
      open={alertDialogOpen}
      onOpenChange={open => {
        setAlertDialogOpen(open);

        if (open) return;

        const isImageUploaded = data.preview.image.size > 0;
        const audiosIdxToRevoke = data.preview.audio.map((a, i) =>
          a.size > 0 ? i : null
        );
        const feedbackAudiosIdxToRevoke = data.preview.feedback.list.map((li, i) =>
          li.audio.size > 0 ? i : null
        );
        const isSomeAudiosUploaded = audiosIdxToRevoke.length > 0;
        const isSomeFeedbackAudioUploaded = feedbackAudiosIdxToRevoke.length > 0;

        if (isImageUploaded) URL.revokeObjectURL(imageObjectURL);

        if (isSomeAudiosUploaded) {
          audiosIdxToRevoke.forEach(idx => {
            if (idx) URL.revokeObjectURL(audiosObjectURLs[idx]);
          });
        }
        if (isSomeFeedbackAudioUploaded) {
          feedbackAudiosIdxToRevoke.forEach(idx => {
            if (idx) URL.revokeObjectURL(feedbackAudiosObjectURLs[idx]);
          });
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

        <ChoiceLabel
          id={id}
          data={data}
        />

        <ChoiceImage
          id={id}
          data={data}
          image={imageObjectURL}
        />

        <ChoiceText
          id={id}
          data={data}
          audio={audiosObjectURLs[0]}
        />

        <ChoiceOptions
          id={id}
          data={data}
        />

        <ChoiceAudios
          id={id}
          audios={[data.audio[1], data.audio[2]]}
          audiosURLs={[audiosObjectURLs[1], audiosObjectURLs[2]]}
        />

        <ChoiceFeedback
          id={id}
          data={data}
          audiosURLs={[feedbackAudiosObjectURLs[0], feedbackAudiosObjectURLs[1]]}
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

          <PreviewChoiceDialog
            id={id}
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

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>
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

                    updateNodeData(id, ({ data }) => ({
                      ...data,
                      preview: {
                        label: data.label,
                        image: data.image,
                        text: data.text,
                        audio: data.audio,
                        options: data.options,
                        feedback: data.feedback,
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
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default EditChoiceDialog;
