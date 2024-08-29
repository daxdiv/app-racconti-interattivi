import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useReactFlow, type Node } from "@xyflow/react";
import { MAX_FILE_SIZE } from "@/constants";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

type ChoiceTextProps = {
  id: string;
  data: ChoiceNodeData;
  audio: string;
};

function ChoiceText({ id, data, audio }: ChoiceTextProps) {
  const { updateNodeData } = useReactFlow<Node<ChoiceNodeData>>();

  return (
    <div className="flex justify-center items-center gap-x-2">
      <div
        className={cn("flex-row justify-center items-center w-1/2", {
          "w-1/3": data.audio[0].size > 0,
        })}
      >
        <Label
          htmlFor="text"
          className="font-extrabold"
        >
          Domanda
        </Label>
        <Input
          id="text"
          value={data.preview.text}
          placeholder="Cosa deve fare Cappuccetto Rosso quando..."
          className="w-full"
          onChange={e => {
            updateNodeData(id, ({ data }) => ({
              ...data,
              preview: { ...data.preview, text: e.target.value },
            }));
          }}
        />
      </div>
      <div
        className={cn("flex-row justify-center items-center w-1/2", {
          "w-1/3": data.audio[0].size > 0,
        })}
      >
        <Label
          htmlFor="audio-text"
          className="font-extrabold"
        >
          Audio domanda
        </Label>
        <Input
          id="audio-text"
          type="file"
          accept="audio/mp3"
          placeholder="Audio domanda"
          className="w-full cursor-pointer"
          onChange={e => {
            const file = e.target.files?.[0];

            if (!file) return;
            if (file.size > MAX_FILE_SIZE) {
              toast.error("Audio troppo grande");

              e.target.value = "";

              return;
            }

            updateNodeData(id, ({ data }) => ({
              ...data,
              preview: {
                ...data.preview,
                audio: [file, data.audio[1], data.audio[2]],
              },
            }));
          }}
        />
      </div>

      {data.audio[0].size > 0 && (
        <div className="flex-row justify-center items-center w-1/3">
          <Label className="font-extrabold">Audio attuale</Label>
          <audio
            controls
            autoPlay={false}
          >
            <source
              src={audio}
              type="audio/mp3"
            />
          </audio>
        </div>
      )}
    </div>
  );
}

export default ChoiceText;
