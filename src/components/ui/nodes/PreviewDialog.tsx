import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Volume2, VolumeX } from "lucide-react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PreviewDialogProps = {
  data: DoublePageNodeData;
  trigger: React.ReactNode;
};

function PreviewDialog({
  data: {
    leftPageNumber,
    rightPageNumber,
    backgroundImage,
    pages: [
      {
        text: { content: leftTextContent, position: leftTextPosition },
      },
      {
        text: { content: rightTextContent, position: rightTextPosition },
      },
    ],
    audio,
  },
  trigger,
}: PreviewDialogProps) {
  const audioEl = new Audio(audio);

  return (
    <Dialog
      onOpenChange={open => {
        if (!open) {
          audioEl.pause();
          audioEl.currentTime = 0;
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-6xl w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Anteprima pagine {leftPageNumber}/{rightPageNumber}
            {audio === "" ? (
              <Button variant="ghost">
                <VolumeX className="nodrag nopan cursor-not-allowed" />
              </Button>
            ) : (
              <Button variant="ghost">
                <Volume2
                  className="nodrag nopan cursor-pointer"
                  onClick={() => {
                    audioEl.paused ? audioEl.play() : audioEl.pause();
                  }}
                />
              </Button>
            )}
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <AspectRatio
          ratio={3 / 2}
          className="relative"
        >
          <img
            src={
              `${backgroundImage}` ||
              "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
            }
            className="absolute rounded-md object-cover w-full h-full"
          />
          <div className="absolute w-1/2 h-full border-r border-r-primary border-dashed">
            <p
              className={cn("font-extrabold italic absolute", {
                "top-10": leftTextPosition.includes("Top"),
                "bottom-10": leftTextPosition.includes("Bottom"),
                "left-10": leftTextPosition.includes("Left"),
                "right-10": leftTextPosition.includes("Right"),
                "top-1/2": leftTextPosition.includes("Middle"),
              })}
            >
              {leftTextContent || "C'era una volta..."}
            </p>
          </div>

          <div className="absolute left-1/2 w-1/2 h-full">
            <p
              className={cn("font-extrabold italic absolute", {
                "top-10": rightTextPosition.includes("Top"),
                "bottom-10": rightTextPosition.includes("Bottom"),
                "left-10": rightTextPosition.includes("Left"),
                "right-10": rightTextPosition.includes("Right"),
                "top-1/2": rightTextPosition.includes("Middle"),
              })}
            >
              {rightTextContent || "...una bambina..."}
            </p>
          </div>
        </AspectRatio>
      </DialogContent>
    </Dialog>
  );
}

export default PreviewDialog;
