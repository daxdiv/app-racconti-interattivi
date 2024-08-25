import { Label } from "@/components/ui/label";
import useNodeUtils from "@/hooks/useNodeUtils";

type ChoiceAudiosFallbackProps = {
  id: string;
  audios: [string, string, string];
};

function ChoiceAudiosFallback({ id, audios }: ChoiceAudiosFallbackProps) {
  const { getNodeData } = useNodeUtils();

  const data = getNodeData(id) as ChoiceNodeData;

  return (
    <div className="flex items-center gap-x-2">
      {data.audio.some(a => a.size > 0) &&
        data.audio.map((a, i) =>
          a.size > 0 ? (
            <div
              key={`${a.name}-${i}`}
              className="flex-row w-1/3"
            >
              <Label className="font-extrabold">Audio attuale</Label>
              <audio
                controls
                autoPlay={false}
              >
                <source
                  src={audios[i]}
                  type="audio/mp3"
                />
              </audio>
            </div>
          ) : (
            <p
              key={`fallback-${i}`}
              className="flex justify-center items-center text-sm text-primary/70 ml-2 w-1/3"
            >
              Nessun audio selezionato
            </p>
          )
        )}
    </div>
  );
}

export default ChoiceAudiosFallback;
