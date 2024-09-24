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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import useDownloadMedia from "@/hooks/nodes/doublePage/useDownloadMedia";
import useUploadMedia from "@/hooks/nodes/doublePage/useUploadMedia";
import useNodeUtils from "@/hooks/useNodeUtils";
import { useState } from "react";
import { useReactFlow, type Node } from "@xyflow/react";
import PageTab from "@/components/ui/nodes/doublePage/edit/pageTab";
import QuestionChoiceTab from "@/components/ui/nodes/doublePage/edit/questionChoiceTab";
import Preview from "@/components/ui/nodes/doublePage/preview";
import toast from "react-hot-toast";
import { truncate } from "@/lib/utils";

type EditNodeDialogProps = {
  id: string;
};

// TODO refactor

const questionFilenames = ["_question", "_question_opt1", "_question_opt2"];
const choiceFilenames = ["_choice", "_choice_opt1", "_choice_opt2"];
const questionFeedbackFilenames = ["_question_feedback_opt1", "_question_feedback_opt2"];
const choiceFeedbackFilenames = ["_choice_feedback_opt1", "_choice_feedback_opt2"];

function EditDialog({ id }: EditNodeDialogProps) {
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const { getNodeData, resetPreview } = useNodeUtils();
  const { updateNodeData } = useReactFlow<Node<DoublePageNodeData>>();
  const data = getNodeData(id);

  const { backgroundImageQuery, audioQuery } = useDownloadMedia(id);
  const { uploadBackgroundImageMutation, uploadAudioMutation } = useUploadMedia(id, {
    backgroundImage:
      data.preview.backgroundImage.size > 0 ? data.preview.backgroundImage : undefined,
    audios: [
      data.preview.audio.size > 0
        ? { file: data.preview.audio, name: `${id}_audio` }
        : undefined,
      ...(data.preview.question?.audio || [])
        .map((a, i) =>
          a.size > 0 ? { file: a, name: `${id}${questionFilenames[i]}` } : undefined
        )
        .filter(Boolean)!,
      ...(data.preview.choice?.audio || [])
        .map((a, i) =>
          a.size > 0 ? { file: a, name: `${id}${choiceFilenames[i]}` } : undefined
        )
        .filter(Boolean)!,
      ...(data.preview.question?.feedback.list || [])
        .map((li, i) =>
          li.audio.size > 0
            ? { file: li.audio, name: `${id}${questionFeedbackFilenames[i]}` }
            : undefined
        )
        .filter(Boolean)!,
      ...(data.preview.choice?.feedback.list || [])
        .map((li, i) =>
          li.audio.size > 0
            ? { file: li.audio, name: `${id}${choiceFeedbackFilenames[i]}` }
            : undefined
        )
        .filter(Boolean)!,
    ].filter(Boolean),
  });

  const backgroundImageObjectURL = URL.createObjectURL(data.preview.backgroundImage);
  const audioObjectURL = URL.createObjectURL(data.preview.audio);
  const questionAudioObjectURLs = data.preview.question?.audio.map(a =>
    URL.createObjectURL(a)
  );
  const choiceAudioObjectURLs = data.preview.choice?.audio.map(a =>
    URL.createObjectURL(a)
  );
  const questionFeedbackAudioObjectURLs = data.preview.question?.feedback.list.map(li =>
    URL.createObjectURL(li.audio)
  );
  const choiceFeedbackAudioObjectURLs = data.preview.choice?.feedback.list.map(li =>
    URL.createObjectURL(li.audio)
  );

  const questionAudios = {
    text: audioQuery.data?.[1] || "",
    firstOption: audioQuery.data?.[3] || "",
    secondOption: audioQuery.data?.[4] || "",
    firstFeedback: audioQuery.data?.[7] || "",
    secondFeedback: audioQuery.data?.[8] || "",
  };
  const choiceAudios = {
    text: audioQuery.data?.[2] || "",
    firstOption: audioQuery.data?.[5] || "",
    secondOption: audioQuery.data?.[6] || "",
    firstFeedback: audioQuery.data?.[9] || "",
    secondFeedback: audioQuery.data?.[10] || "",
  };

  const handleSave = () => {
    // const isImageUploaded = data.preview.backgroundImage.size > 0;
    // const isAudioUploaded = data.preview.audio.size > 0;

    // const oldData: Partial<DoublePageNodeData> = {
    //   label: data.label,
    //   leftPageNumber: data.leftPageNumber,
    //   rightPageNumber: data.rightPageNumber,
    //   pages: data.pages,
    //   question: data.question,
    //   choice: data.choice
    // };
    // const newData: Partial<DoublePageNodeData> = {
    //   label: data.preview.label,
    //   leftPageNumber: data.preview.leftPageNumber,
    //   rightPageNumber: data.preview.rightPageNumber,
    //   pages: data.preview.pages,
    //   question: data.question?.preview,
    //   choice: data.choice?.preview,
    // };

    // if (equalObjects(oldData, newData) && !isImageUploaded && !isAudioUploaded) return;

    // if (isImageUploaded) uploadBackgroundImageMutation.mutate();
    // if (isAudioUploaded) uploadAudioMutation.mutate();
    uploadBackgroundImageMutation.mutate();
    uploadAudioMutation.mutate();

    updateNodeData(id, ({ data }) => ({
      ...data.preview,
      question: data.preview.question,
      choice: data.preview.choice,
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

          questionAudioObjectURLs?.forEach(a => URL.revokeObjectURL(a));
          choiceAudioObjectURLs?.forEach(a => URL.revokeObjectURL(a));
          questionFeedbackAudioObjectURLs?.forEach(a => URL.revokeObjectURL(a));
          choiceFeedbackAudioObjectURLs?.forEach(a => URL.revokeObjectURL(a));
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
            Modifica "{truncate(data.label, 12)}"
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription />

        <Tabs defaultValue="page">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="page">Pagine</TabsTrigger>
            <TabsTrigger value="question">Domanda</TabsTrigger>
            <TabsTrigger value="choice">Scelta</TabsTrigger>
          </TabsList>

          <TabsContent
            value="page"
            className="h-[640px]"
          >
            <PageTab id={id} />
          </TabsContent>
          <TabsContent
            value="question"
            className="h-[640px]"
          >
            <QuestionChoiceTab
              id={id}
              data={data}
              audios={questionAudios}
              field="question"
              disabled={
                data.choice !== undefined ||
                data.preview.choice !== undefined ||
                Object.values(choiceAudios).some(Boolean)
              }
            />
          </TabsContent>
          <TabsContent
            value="choice"
            className="h-[640px]"
          >
            <QuestionChoiceTab
              id={id}
              data={data}
              audios={choiceAudios}
              field="choice"
              disabled={
                data.question !== undefined ||
                data.preview.question !== undefined ||
                Object.values(questionAudios).some(Boolean)
              }
            />
          </TabsContent>
        </Tabs>

        <AlertDialogFooter className="flex justify-between sm:justify-between items-center w-full">
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

                    resetPreview(id);
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
            <Preview
              id={id}
              data={data.preview}
              media={{
                backgroundImage:
                  data.preview.backgroundImage.size > 0
                    ? backgroundImageObjectURL
                    : backgroundImageQuery.data || "",
                audio:
                  data.preview.audio.size > 0
                    ? audioObjectURL
                    : audioQuery.data?.[0] || "",
                question: {
                  text:
                    data.preview.question?.audio?.[0] &&
                    data.preview.question.audio[0].size > 0
                      ? questionAudioObjectURLs?.[0]
                        ? questionAudioObjectURLs[0]
                        : audioQuery.data?.[1] || ""
                      : audioQuery.data?.[1] || "",
                  firstOption:
                    data.preview.question?.audio?.[1] &&
                    data.preview.question.audio[1].size > 0
                      ? questionAudioObjectURLs?.[1]
                        ? questionAudioObjectURLs[1]
                        : audioQuery.data?.[3] || ""
                      : audioQuery.data?.[3] || "",
                  secondOption:
                    data.preview.question?.audio?.[2] &&
                    data.preview.question.audio[2].size > 0
                      ? questionAudioObjectURLs?.[2]
                        ? questionAudioObjectURLs[2]
                        : audioQuery.data?.[4] || ""
                      : audioQuery.data?.[4] || "",
                  firstFeedback:
                    data.preview.question?.feedback.list[0].audio &&
                    data.preview.question?.feedback.list[0].audio.size > 0
                      ? questionFeedbackAudioObjectURLs?.[0]
                        ? questionFeedbackAudioObjectURLs[0]
                        : audioQuery.data?.[7] || ""
                      : audioQuery.data?.[7] || "",
                  secondFeedback:
                    data.preview.question?.feedback.list[1].audio &&
                    data.preview.question.feedback.list[1].audio.size > 0
                      ? questionFeedbackAudioObjectURLs?.[1]
                        ? questionFeedbackAudioObjectURLs[1]
                        : audioQuery.data?.[8] || ""
                      : audioQuery.data?.[8] || "",
                },
                choice: {
                  text:
                    data.preview.choice?.audio?.[0] &&
                    data.preview.choice.audio[0].size > 0
                      ? choiceAudioObjectURLs?.[0]
                        ? choiceAudioObjectURLs[0]
                        : audioQuery.data?.[2] || ""
                      : audioQuery.data?.[2] || "",
                  firstOption:
                    data.preview.choice?.audio?.[1] &&
                    data.preview.choice.audio[1].size > 0
                      ? choiceAudioObjectURLs?.[1]
                        ? choiceAudioObjectURLs[1]
                        : audioQuery.data?.[5] || ""
                      : audioQuery.data?.[5] || "",
                  secondOption:
                    data.preview.choice?.audio?.[2] &&
                    data.preview.choice.audio[2].size > 0
                      ? choiceAudioObjectURLs?.[2]
                        ? choiceAudioObjectURLs[2]
                        : audioQuery.data?.[6] || ""
                      : audioQuery.data?.[6] || "",
                  firstFeedback:
                    data.preview.choice?.feedback.list[0].audio &&
                    data.preview.choice?.feedback.list[0].audio.size > 0
                      ? choiceFeedbackAudioObjectURLs?.[0]
                        ? choiceFeedbackAudioObjectURLs[0]
                        : audioQuery.data?.[9] || ""
                      : audioQuery.data?.[9] || "",
                  secondFeedback:
                    data.preview.choice?.feedback.list[1].audio &&
                    data.preview.choice.feedback.list[1].audio.size > 0
                      ? choiceFeedbackAudioObjectURLs?.[1]
                        ? choiceFeedbackAudioObjectURLs[1]
                        : audioQuery.data?.[10] || ""
                      : audioQuery.data?.[10] || "",
                },
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
