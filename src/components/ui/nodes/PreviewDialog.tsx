import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, Volume2 } from "lucide-react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { TooltipTrigger } from "@/components/ui/tooltip";

function PreviewDialog({
  leftPageNumber,
  rightPageNumber,
  backgroundImage,
  audio,
}: DoublePageNodeData) {
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
      <DialogTrigger asChild>
        <TooltipTrigger asChild>
          <Eye
            className="cursor-pointer text-secondary p-1 rounded-full bg-primary hover:bg-primary/70 nodrag nopan"
            size={24}
          />
        </TooltipTrigger>
      </DialogTrigger>
      <DialogContent className="max-w-6xl w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Anteprima pagine {leftPageNumber}/{rightPageNumber}
            <Button variant="ghost">
              <Volume2
                className="nodrag nopan"
                onClick={() => {
                  audioEl.paused ? audioEl.play() : audioEl.pause();
                }}
              />
            </Button>
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
        </AspectRatio>
      </DialogContent>
    </Dialog>
  );
}

export default PreviewDialog;
