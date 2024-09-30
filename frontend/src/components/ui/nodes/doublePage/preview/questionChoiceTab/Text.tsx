import { useFormContext } from "react-hook-form";
import { useNodeQueryContext } from "@/hooks/useNodeQueryContext";

type TextProps = {
  field: "question" | "choice";
};

function Text({ field }: TextProps) {
  const { data } = useNodeQueryContext();
  const form = useFormContext();
  const formTextAudio = form.watch(`${field}.audio.0`);
  const textAudio =
    formTextAudio && formTextAudio.size > 0
      ? URL.createObjectURL(formTextAudio)
      : data?.[field]?.audio[0] || "";

  return (
    <div className="flex justify-center items-center gap-x-2 mb-4">
      <p className="break-words">
        <span className="font-extrabold">Testo: </span>
        {form.getValues(`${field}.text`)}
      </p>

      {textAudio && (
        <audio
          controls
          autoPlay={false}
        >
          <source
            src={textAudio as string}
            type="audio/mp3"
          />
        </audio>
      )}
    </div>
  );
}

export default Text;
