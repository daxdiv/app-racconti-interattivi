import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useReactFlow, type Node } from "@xyflow/react";
import { MAX_FILE_SIZE } from "@/constants";
import toast from "react-hot-toast";

type ChoiceAudiosProps = {
  id: string;
  audios: [File, File];
  audiosURLs: [string, string];
};

function ChoiceAudios({ id, audios, audiosURLs }: ChoiceAudiosProps) {
  const { updateNodeData } = useReactFlow<Node<ChoiceNodeData>>();

  return (
    <>
      <div className="flex justify-center items-center gap-x-2">
        <div className="flex-row w-1/2">
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
              if (file.size > MAX_FILE_SIZE) {
                toast.error("Audio troppo grande");

                e.target.value = "";

                return;
              }

              updateNodeData(id, ({ data }) => ({
                ...data,
                preview: {
                  ...data.preview,
                  audio: [data.audio[0], file, data.audio[2]],
                },
              }));
            }}
          />
        </div>

        <div className="flex-row w-1/2">
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
              if (file.size > MAX_FILE_SIZE) {
                toast.error("Audio troppo grande");

                e.target.value = "";

                return;
              }

              updateNodeData(id, ({ data }) => ({
                ...data,
                preview: {
                  ...data.preview,
                  audio: [data.audio[0], data.audio[1], file],
                },
              }));
            }}
          />
        </div>
      </div>

      {audios.some(a => a.size > 0) && (
        <div className="flex justify-center items-center gap-x-2">
          {audios.map((a, i) =>
            a.size > 0 ? (
              <div
                key={`${a.name}-${i}`}
                className="flex-row justify-start items-center gap-x-2 w-1/2"
              >
                <Label className="font-extrabold">Audio attuale</Label>
                <audio
                  controls
                  autoPlay={false}
                >
                  <source
                    src={audiosURLs[i]}
                    type="audio/mp3"
                  />
                </audio>
              </div>
            ) : (
              <p
                key={`fallback-${i}`}
                className="flex-row justify-start items-center text-sm text-primary/70 ml-2 w-1/2"
              >
                Nessun audio selezionato
              </p>
            )
          )}
        </div>
      )}
    </>
  );
}

export default ChoiceAudios;
