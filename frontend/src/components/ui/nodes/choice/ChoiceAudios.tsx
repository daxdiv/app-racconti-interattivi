import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useReactFlow, type Node } from "@xyflow/react";

type ChoiceAudiosProps = {
  id: string;
};

function ChoiceAudios({ id }: ChoiceAudiosProps) {
  const { updateNodeData } = useReactFlow<Node<ChoiceNodeData>>();

  return (
    <div className="flex justify-center items-center gap-x-2">
      <div className="flex-row w-1/3">
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

            updateNodeData(id, ({ data }) => ({
              ...data,
              preview: {
                ...data.preview,
                audio: [file, data.preview.audio[1], data.preview.audio[2]],
              },
            }));
          }}
        />
      </div>

      <div className="flex-row w-1/3">
        <Label
          htmlFor="audio-option-1"
          className="font-extrabold"
        >
          Audio prima opzione
        </Label>
        <Input
          id="audio-option-1"
          type="file"
          accept="audio/mp3"
          placeholder="Audio prima opzione"
          className="w-full cursor-pointer"
          onChange={e => {
            const file = e.target.files?.[0];

            if (!file) return;

            updateNodeData(id, ({ data }) => ({
              ...data,
              preview: {
                ...data.preview,
                audio: [data.preview.audio[0], file, data.preview.audio[2]],
              },
            }));
          }}
        />
      </div>

      <div className="flex-row w-1/3">
        <Label
          htmlFor="audio-option-2"
          className="font-extrabold"
        >
          Audio seconda opzione
        </Label>
        <Input
          id="audio-option-2"
          type="file"
          accept="audio/mp3"
          placeholder="Audio seconda opzione"
          className="w-full cursor-pointer"
          onChange={e => {
            const file = e.target.files?.[0];

            if (!file) return;

            updateNodeData(id, ({ data }) => ({
              ...data,
              preview: {
                ...data.preview,
                audio: [data.preview.audio[0], data.preview.audio[1], file],
              },
            }));
          }}
        />
      </div>
    </div>
  );
}

export default ChoiceAudios;
