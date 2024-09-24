import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { DEFAULT_BACKGROUND_URL } from "@/constants";
import PageTab from "@/components/ui/nodes/doublePage/preview/pageTab";
import QuestionChoiceTab from "@/components/ui/nodes/doublePage/preview/questionChoiceTab";
import { truncate } from "@/lib/utils";
import useDownloadMedia from "@/hooks/nodes/doublePage/useDownloadMedia";
import { useMemo } from "react";

type PreviewDialogProps = {
  id: string;
  data: DoublePageNodeDataWithoutPreview;
  media?: {
    backgroundImage: string;
    audio: string;
    question: {
      text: string;
      firstOption: string;
      secondOption: string;
      firstFeedback: string;
      secondFeedback: string;
    };
    choice: {
      text: string;
      firstOption: string;
      secondOption: string;
      firstFeedback: string;
      secondFeedback: string;
    };
  };
  trigger: React.ReactNode;
};

function PreviewDialog({ id, data, media, trigger }: PreviewDialogProps) {
  const { backgroundImageQuery, audioQuery } = useDownloadMedia(id);
  const audioSrc = audioQuery.data?.[0] || media?.audio || "";
  const audio = useMemo(() => new Audio(audioSrc), [audioSrc]);
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

  return (
    <Dialog
      onOpenChange={open => {
        if (open && !media) {
          backgroundImageQuery.refetch();
          audioQuery.refetch();
        }
        if (!open) {
          audio.pause();
          audio.currentTime = 0;
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-6xl w-full">
        <DialogHeader>
          <DialogTitle>Anteprima "{truncate(data.label, 12)}"</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <Tabs defaultValue="preview-page">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview-page">Pagine</TabsTrigger>
            <TabsTrigger value="preview-question">Domanda</TabsTrigger>
            <TabsTrigger value="preview-choice">Scelta</TabsTrigger>
          </TabsList>

          <TabsContent
            value="preview-page"
            className="h-[700px]"
          >
            <PageTab
              data={data}
              media={{
                backgroundImage:
                  (media?.backgroundImage
                    ? media.backgroundImage
                    : backgroundImageQuery.data) || DEFAULT_BACKGROUND_URL,
                audio: (media?.audio ? media.audio : audioQuery.data?.[0]) || "",
              }}
            />

            {(media?.audio ? media.audio : audioQuery.data?.[0]) ? (
              <audio
                controls
                autoPlay={false}
                className="mt-2"
              >
                <source
                  src={audio.src}
                  type="audio/mp3"
                />
              </audio>
            ) : (
              <p className="text-sm text-primary/70 ml-2 mt-2">
                Nessun audio selezionato
              </p>
            )}
          </TabsContent>
          <TabsContent
            value="preview-question"
            className="h-[700px]"
          >
            <QuestionChoiceTab
              data={data}
              audios={questionAudios}
              media={media?.question}
              field="question"
            />
          </TabsContent>
          <TabsContent
            value="preview-choice"
            className="h-[700px]"
          >
            <QuestionChoiceTab
              data={data}
              audios={choiceAudios}
              media={media?.choice}
              field="choice"
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default PreviewDialog;
