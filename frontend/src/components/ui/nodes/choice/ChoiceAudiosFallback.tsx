import { Label } from "@/components/ui/label";

type ChoiceAudiosFallbackProps = {
  id: string;
  audios: [File, File];
  audiosUrls: [string, string];
};

function ChoiceAudiosFallback({ audios, audiosUrls }: ChoiceAudiosFallbackProps) {
  return (
    <div className="flex items-center gap-x-2">
      {audios.some(a => a.size > 0) &&
        audios.map((a, i) =>
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
                  src={audiosUrls[i]}
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
  );
}

export default ChoiceAudiosFallback;
