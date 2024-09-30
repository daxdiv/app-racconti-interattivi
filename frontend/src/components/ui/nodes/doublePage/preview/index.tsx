import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import PageTab from "@/components/ui/nodes/doublePage/preview/pageTab";
import QuestionChoiceTab from "@/components/ui/nodes/doublePage/preview/questionChoiceTab";
import { truncate } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { useNodeQueryContext } from "@/hooks/useNodeQueryContext";

type PreviewDialogProps = {
  trigger: React.ReactNode;
};

function PreviewDialog({ trigger }: PreviewDialogProps) {
  const form = useFormContext();
  const { data } = useNodeQueryContext();
  const formAudio = form.watch("audio");
  const audio = formAudio.size > 0 ? URL.createObjectURL(formAudio) : data?.audio || "";

  return (
    <Dialog
      onOpenChange={open => {
        if (!open && formAudio.size > 0) {
          URL.revokeObjectURL(audio as string);
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-6xl w-full">
        <DialogHeader>
          <DialogTitle>Anteprima "{truncate(form.getValues("label"), 12)}"</DialogTitle>
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
            <PageTab />

            {audio ? (
              <audio
                controls
                autoPlay={false}
                className="mt-2"
              >
                <source
                  src={audio as string}
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
            {form.getValues("type") === "question" && (
              <QuestionChoiceTab field="question" />
            )}
          </TabsContent>
          <TabsContent
            value="preview-choice"
            className="h-[700px]"
          >
            {form.getValues("type") === "choice" && <QuestionChoiceTab field="choice" />}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default PreviewDialog;
