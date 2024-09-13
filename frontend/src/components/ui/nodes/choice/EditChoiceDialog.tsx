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
import ChoiceAudios from "@/components/ui/nodes/choice/ChoiceAudios";
import ChoiceFeedback from "@/components/ui/nodes/choice/ChoiceFeedback";
import ChoiceImage from "@/components/ui/nodes/choice/ChoiceImage";
import ChoiceLabel from "@/components/ui/nodes/choice/ChoiceLabel";
import ChoiceOptions from "@/components/ui/nodes/choice/ChoiceOptions";
import ChoiceText from "@/components/ui/nodes/choice/ChoiceText";
import PreviewChoiceDialog from "@/components/ui/nodes/choice/PreviewChoiceDialog";
import toast from "react-hot-toast";
import useChoiceDownload from "@/hooks/nodes/choice/useChoiceDownload";
import useChoiceUpload from "@/hooks/nodes/choice/useChoiceUpload";
import { useState } from "react";
import { useReactFlow, type Node } from "@xyflow/react";

type EditChoiceDialogProps = {
  id: string;
  data: ChoiceNodeData;
};

function EditChoiceDialog({ id, data }: EditChoiceDialogProps) {
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const { updateNodeData } = useReactFlow<Node<ChoiceNodeData>>();
  const { uploadImage, uploadAudio } = useChoiceUpload(id);
  const { backgroundQuery, audioQuery, feedbackAudioQuery } = useChoiceDownload(id);

  const handleSave = async () => {
    const isImageUploaded = data.preview.image.size > 0;
    const fileSuffixMap: Record<number, "choice" | "option-1" | "option-2"> = {
      0: "choice",
      1: "option-1",
      2: "option-2",
    };

    if (isImageUploaded) uploadImage.mutate(data.preview.image);

    const uploads = data.preview.audio.map((a, i) => {
      if (a.size > 0) {
        return uploadAudio.mutateAsync({
          file: a,
          of: fileSuffixMap[i],
          feedback: false,
        });
      }

      return new Promise(() => {});
    });

    uploads.concat(
      data.preview.feedback.list.map((li, i) => {
        if (li.audio.size > 0) {
          return uploadAudio.mutateAsync({
            file: li.audio,
            of: i === 0 ? "option-1" : "option-2",
            feedback: true,
          });
        }

        return new Promise(() => {});
      })
    );

    updateNodeData(id, {
      ...data.preview,
      preview: data.preview,
    });

    toast.success("Modifiche salvate", { duration: 3000 });

    await Promise.all(uploads);
  };

  return (
    <AlertDialog
      open={alertDialogOpen}
      onOpenChange={open => {
        setAlertDialogOpen(open);

        if (open) {
          backgroundQuery.refetch();
          audioQuery.refetch();
          feedbackAudioQuery.refetch();
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
          image={backgroundQuery.data}
        />

        <ChoiceText
          id={id}
          data={data}
          audio={audioQuery.data?.[0]}
        />

        <ChoiceOptions
          id={id}
          data={data}
        />

        <ChoiceAudios
          id={id}
          audios={[audioQuery.data?.[1], audioQuery.data?.[2]]}
        />

        <ChoiceFeedback
          id={id}
          data={data}
          audios={[feedbackAudioQuery.data?.[0], feedbackAudioQuery.data?.[1]]}
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

                    updateNodeData(id, ({ data }) => ({
                      ...data,
                      preview: {
                        label: data.label,
                        image: new File([], ""),
                        text: data.text,
                        audio: [new File([], ""), new File([], ""), new File([], "")],
                        options: data.options,
                        feedback: {
                          list: [
                            {
                              text: data.feedback.list[0].text,
                              audio: new File([], ""),
                            },
                            {
                              text: data.feedback.list[1].text,
                              audio: new File([], ""),
                            },
                          ],
                          option: data.feedback.option,
                        },
                      },
                      // preview: {
                      // label: data.label,
                      // image: new File([], ""),
                      // text: data.text,
                      // audio: [new File([], ""), new File([], ""), new File([], "")],
                      // options: data.options,
                      // feedback: data.feedback,
                      // },
                    }));
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
            <PreviewChoiceDialog
              id={id}
              data={data.preview}
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

export default EditChoiceDialog;
