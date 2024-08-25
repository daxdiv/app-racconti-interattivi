import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useMemo } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useNodeUtils from "@/hooks/useNodeUtils";
import { useReactFlow, type Node } from "@xyflow/react";
import { MAX_FILE_SIZE } from "@/constants";
import toast from "react-hot-toast";

type PageMediaProps = {
  id: string;
  media: {
    backgroundImage: string;
    audio: string;
  };
};

function PageMedia({ id, media }: PageMediaProps) {
  const { getNodeData } = useNodeUtils();
  const { updateNodeData } = useReactFlow<Node<DoublePageNodeData>>();
  const data = getNodeData(id) as DoublePageNodeData;
  const audio = useMemo(() => new Audio(media.audio), [media.audio]);

  useEffect(() => {
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [media.audio]);

  return (
    <div className="flex gap-2 w-full">
      <div className="flex flex-col w-full gap-2">
        <Label
          htmlFor="background"
          className="font-extrabold"
        >
          Sfondo pagine {data.leftPageNumber}/{data.rightPageNumber}
        </Label>
        <Input
          id="background"
          type="file"
          accept="image/*"
          className="cursor-pointer w-full"
          onChange={e => {
            const file = e.target.files?.[0];

            if (!file) return;
            if (file.size > MAX_FILE_SIZE) {
              toast.error("Immagine troppo grande, non verrà usata nell'anteprima");

              return;
            }

            updateNodeData(id, {
              preview: {
                ...data.preview,
                backgroundImage: file,
              },
            });
          }}
        />

        {media.backgroundImage && (
          <div className="flex justify-start items-center gap-2">
            <Label
              htmlFor="selected-img"
              className="font-extrabold ml-3"
            >
              Sfondo attuale
            </Label>
            <Avatar
              id="selected-img"
              className="rounded-none"
            >
              <AvatarImage src={media.backgroundImage} />
              <AvatarFallback>IMG</AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>

      <div className="flex flex-col w-full gap-2">
        <Label
          htmlFor="audio"
          className="font-extrabold"
        >
          Audio pagine {data.leftPageNumber}/{data.rightPageNumber}
        </Label>
        <Input
          id="audio"
          type="file"
          accept="audio/mp3"
          className="cursor-pointer w-full"
          onChange={e => {
            const file = e.target.files?.[0];

            if (!file) return;
            if (file.size > MAX_FILE_SIZE) {
              toast.error("Audio troppo grande, non verrà usato nell'anteprima");

              return;
            }

            updateNodeData(id, {
              preview: {
                ...data.preview,
                audio: file,
              },
            });
          }}
        />

        {media.audio && (
          <div className="flex justify-start items-center gap-2">
            <Label
              htmlFor="selected-audio"
              className="font-extrabold ml-3"
            >
              Audio attuale
            </Label>
            <audio
              id="selected-audio"
              controls
              autoPlay={false}
            >
              <source
                src={audio.src}
                type="audio/mp3"
              />
            </audio>
          </div>
        )}
      </div>
    </div>
  );
}

export default PageMedia;
