import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import useDownloadMedia from "@/hooks/useDownloadMedia";
import { useMemo } from "react";

type PreviewDialogProps = {
  id: string;
  data: DoublePageNodeDataWithoutPreview;
  media?: { backgroundImage?: string; audio?: string };
  trigger: React.ReactNode;
};

function PreviewDialog({
  id,
  data: {
    leftPageNumber,
    rightPageNumber,
    pages: [
      {
        text: { content: leftTextContent, position: leftTextPosition },
      },
      {
        text: { content: rightTextContent, position: rightTextPosition },
      },
    ],
  },
  media,
  trigger,
}: PreviewDialogProps) {
  const { backgroundImageQuery, audioQuery } = useDownloadMedia(id);
  const audioSrc = audioQuery.data || media?.audio || "";
  const audio = useMemo(() => new Audio(audioSrc), [audioSrc]);

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
          <DialogTitle className="flex items-center gap-2">
            Anteprima pagine {leftPageNumber}/{rightPageNumber}
            {(media?.audio ? media.audio : audioQuery.data) ? (
              <audio
                controls
                onDurationChange={e => e.preventDefault()}
                autoPlay={false}
              >
                <source
                  src={audio.src}
                  type="audio/mp3"
                />
              </audio>
            ) : (
              <p className="text-sm text-primary/70 ml-2">Nessun audio selezionato</p>
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
              (media?.backgroundImage
                ? media.backgroundImage
                : backgroundImageQuery.data) ||
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
