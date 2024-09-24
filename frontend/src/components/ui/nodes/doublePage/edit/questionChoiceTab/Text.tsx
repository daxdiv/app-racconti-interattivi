import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MAX_FILE_SIZE } from "@/constants";
import { useReactFlow, type Node } from "@xyflow/react";
import toast from "react-hot-toast";

type TextareaProps = {
  id: string;
  data: DoublePageNodeData;
  field: "question" | "choice";
  audio: string | undefined;
};

function Textarea({ id, data, field, audio }: TextareaProps) {
  const { updateNodeData } = useReactFlow<Node<DoublePageNodeData>>();

  return (
    <div className="mt-2 flex flex-col">
      <div className="flex justify-center items-center gap-x-2">
        <div className="flex-row justify-center items-center w-1/2">
          <Label
            htmlFor="audio-text"
            className="font-extrabold"
          >
            Audio testo
          </Label>
          <Input
            id="audio-text"
            type="file"
            accept="audio/mp3"
            placeholder="Audio"
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
                preview: {
                  ...data.preview,
                  [field]: {
                    ...data.preview[field],
                    audio: [
                      file,
                      data.preview[field]?.audio[1],
                      data.preview[field]?.audio[2],
                    ],
                  },
                },
              }));
            }}
          />
        </div>

        <div className="flex-row justify-center items-center w-1/2">
          <Label
            htmlFor="text"
            className="font-extrabold"
          >
            Testo
          </Label>
          <Input
            id="text"
            value={data.preview[field]?.text || ""}
            placeholder="Cosa deve fare Cappuccetto Rosso quando..."
            className="w-full"
            onChange={e => {
              updateNodeData(id, ({ data }) => ({
                preview: {
                  ...data.preview,
                  [field]: {
                    ...data.preview[field],
                    text: e.target.value,
                  },
                },
              }));
            }}
          />
        </div>
      </div>

      {audio && (
        <div className="mt-2 flex-row justify-center items-center">
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

export default Textarea;
