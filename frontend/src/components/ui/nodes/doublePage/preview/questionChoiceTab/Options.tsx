import { useFormContext } from "react-hook-form";
import { useNodeQueryContext } from "@/hooks/useNodeQueryContext";

type OptionsProps = {
  field: "question" | "choice";
};

function Options({ field }: OptionsProps) {
  const { data } = useNodeQueryContext();
  const form = useFormContext();
  const formFirstOptionAudio = form.watch(`${field}.audio.1`);
  const formSecondOptionAudio = form.watch(`${field}.audio.2`);
  const firstOptionAudio =
    formFirstOptionAudio && formFirstOptionAudio.size > 0
      ? URL.createObjectURL(formFirstOptionAudio)
      : data?.[field]?.audio[1] || "";
  const secondOptionAudio =
    formSecondOptionAudio && formSecondOptionAudio.size > 0
      ? URL.createObjectURL(formSecondOptionAudio)
      : data?.[field]?.audio[1] || "";

  return (
    <div>
      <div className="flex justify-center items-center gap-x-5">
        <div className="flex justify-center items-center bg-muted-foreground/65 rounded-full size-32">
          <p>{data?.[field]?.options[0]}</p>
        </div>
        <div className="flex justify-center items-center bg-muted-foreground/65 rounded-full size-32">
          <p>{data?.[field]?.options[1]}</p>
        </div>
      </div>

      <div className="mt-2 flex justify-center items-center gap-x-2">
        {firstOptionAudio ? (
          <audio
            controls
            autoPlay={false}
          >
            <source
              src={firstOptionAudio as string}
              type="audio/mp3"
            />
          </audio>
        ) : (
          <p className="flex justify-start items-center text-sm text-primary/70 ml-2 w-1/2">
            Nessun audio selezionato
          </p>
        )}

        {secondOptionAudio ? (
          <audio
            controls
            autoPlay={false}
          >
            <source
              src={secondOptionAudio as string}
              type="audio/mp3"
            />
          </audio>
        ) : (
          <p className="flex justify-start items-center text-sm text-primary/70 ml-2 w-1/2">
            Nessun audio selezionato
          </p>
        )}
      </div>
    </div>
  );
}

export default Options;
