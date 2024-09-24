import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useMemo } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useReactFlow, type Node } from "@xyflow/react";
import { MAX_FILE_SIZE } from "@/constants";
import useDownloadMedia from "@/hooks/nodes/doublePage/useDownloadMedia";
import toast from "react-hot-toast";
import { truncate } from "@/lib/utils";

type MediaProps = {
  id: string;
  data: DoublePageNodeData;
};

function Media({ id, data }: MediaProps) {
  const { backgroundImageQuery, audioQuery } = useDownloadMedia(id);
  const { updateNodeData } = useReactFlow<Node<DoublePageNodeData>>();
  const audio = useMemo(
    () => new Audio(audioQuery.data?.[0] || ""),
    [audioQuery.data?.[0]]
  );

  useEffect(() => {
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audioQuery.data?.[0]]);

  return (
    <div className="mt-3 flex gap-2 w-full">
      <div className="flex flex-col w-full gap-2">
        <Label
          htmlFor="background"
          className="font-extrabold"
        >
          Sfondo per "{truncate(data.label, 12)}"{" "}
          <span className="text-muted-foreground/50 text-xs">
            (dimensioni consigliate 1920x1080)
          </span>
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
              toast.error("Immagine troppo grande");

              e.target.value = "";

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

        {backgroundImageQuery.data && (
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
              <AvatarImage src={backgroundImageQuery.data} />
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
          Audio per "{truncate(data.label, 12)}"
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
              toast.error("Audio troppo grande");

              e.target.value = "";

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

        {audioQuery.data?.[0] && (
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

export default Media;
