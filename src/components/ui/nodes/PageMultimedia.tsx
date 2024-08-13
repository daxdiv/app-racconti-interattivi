import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useMemo } from "react";

import { Button } from "@/components/ui/button";
import type { DoublePageNodeAction } from "@/hooks/useNodeReducer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Volume2 } from "lucide-react";

type PageMultimediaProps = {
  data: DoublePageNodeData;
  prevData: DoublePageNodeData;
  dispatch: React.Dispatch<DoublePageNodeAction>;
};

function PageMultimedia({ data, prevData, dispatch }: PageMultimediaProps) {
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
            dispatch({ payload: e.target.files?.[0], type: "IMAGE_UPLOAD" });
          }}
        />

        {prevData.backgroundImage !== "" && (
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
              <AvatarImage src={prevData.backgroundImage || ""} />
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
            dispatch({
              payload: e.target.files?.[0],
              type: "AUDIO_UPLOAD",
              onReject: () => {
                alert("Audio troppo grande");
                e.target.files = null;
                e.target.value = "";
              },
            });
          }}
        />

        {prevData.audio !== "" && (
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
