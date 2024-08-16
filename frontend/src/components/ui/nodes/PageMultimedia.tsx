import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Volume2 } from "lucide-react";
import useNodeUtils from "@/hooks/useNodeUtils";

type PageMultimediaProps = {
  id: string;
};

function PageMultimedia({ id }: PageMultimediaProps) {
  const { getNodeData, updateNodeData } = useNodeUtils();
  const data = getNodeData(id);
  const audio = useMemo(() => new Audio(data.audio), [data.audio]);

  useEffect(() => {
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio]);

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

            updateNodeData(id, {
              preview: {
                ...data.preview,
                backgroundImage: URL.createObjectURL(file),
              },
            });
          }}
        />

        {data.backgroundImage !== "" && (
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
              <AvatarImage src={data.backgroundImage || ""} />
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
          accept="audio/*"
          className="cursor-pointer w-full"
          onChange={e => {
            const file = e.target.files?.[0];

            if (!file) return;

            updateNodeData(id, {
              preview: {
                ...data.preview,
                audio: URL.createObjectURL(file),
              },
            });
          }}
        />

        {data.audio !== "" && (
          <div className="flex justify-start items-center gap-2">
            <Label
              htmlFor="selected-audio"
              className="font-extrabold ml-3"
            >
              Audio attuale
            </Label>
            <Button variant="ghost">
              <Volume2
                className="nodrag nopan"
                onClick={() => {
                  audio.paused ? audio.play() : audio.pause();
                }}
              />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PageMultimedia;
