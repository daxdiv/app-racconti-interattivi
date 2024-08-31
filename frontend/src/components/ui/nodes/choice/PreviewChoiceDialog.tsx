import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn, truncate } from "@/lib/utils";

type PreviewChoiceDialogProps = {
  id: string;
  data: ChoiceNodeDataWithoutPreview;
  trigger: React.ReactNode;
};

function PreviewChoiceDialog({ data, trigger }: PreviewChoiceDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Anteprima scelta "{truncate(data.label, 12)}"
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <Card>
          <CardContent className="pt-6 flex flex-col justify-center items-center">
            {data.text && (
              <p
                className={cn("break-words", {
                  "text-muted-foreground": data.text.length === 0,
                })}
              >
                {data.text}
              </p>
            )}

            <div className="flex justify-center items-center gap-x-5">
              <div className="flex justify-center items-center bg-muted-foreground/65 rounded-full size-32">
                {data.options[0]}
              </div>
              <div className="flex justify-center items-center bg-muted-foreground/65 rounded-full size-32">
                {data.options[1]}
              </div>
            </div>

            {data.options[0] && (
              <div className="flex-col mt-4">
                <p className="font-extrabold justify-start mb-2">
                  {" "}
                  Feedback scegliendo "{data.options[0]}"
                </p>

                <div className="flex justify-center items-center flex-col">
                  <p className="text-sm break-words">{data.feedback.list[0].text}</p>

                  <div className="flex justify-center items-center bg-muted-foreground/65 rounded-full size-24 text-sm mt-2">
                    Continuare
                  </div>
                </div>
              </div>
            )}

            {data.options[1] && (
              <div className="flex-col mt-4">
                <p className="font-extrabold mb-2">
                  {" "}
                  Feedback scegliendo "{data.options[1]}"
                </p>

                <div className="flex justify-center items-center flex-col">
                  <p className="text-sm break-words">{data.feedback.list[0].text}</p>

                  <div className="flex justify-center items-center bg-muted-foreground/65 rounded-full size-24 text-sm mt-2">
                    Continuare
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

export default PreviewChoiceDialog;
