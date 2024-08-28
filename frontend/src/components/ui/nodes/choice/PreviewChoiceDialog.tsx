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
  data: ChoiceNodeData;
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
          <CardContent className="pt-6 justify-center items-center gap-y-3">
            <p
              className={cn({
                "text-muted-foreground": data.text.length === 0,
              })}
            >
              {data.text || "Cosa deve fare Cappuccetto Rosso quando incontra il lupo?"}
            </p>

            <div className="flex justify-center items-center gap-x-5">
              <div className="flex justify-center items-center transition-colors bg-muted-foreground/65 hover:bg-muted-foreground/50 rounded-full size-28 cursor-pointer">
                {data.options[0]}
              </div>
              <div className="flex justify-center items-center transition-colors bg-muted-foreground/65 hover:bg-muted-foreground/50 rounded-full size-28 cursor-pointer">
                {data.options[1]}
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

export default PreviewChoiceDialog;
