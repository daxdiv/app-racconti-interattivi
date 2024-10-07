import type { PageSchema } from "@/lib/zod";
import { useFormContext } from "react-hook-form";

type TextProps = {
  field: "question" | "choice";
};

function Text({ field }: TextProps) {
  const form = useFormContext<PageSchema>();
  const formTextAudio = form.watch(`${field}.audio.0`);
  const textAudio =
    typeof formTextAudio === "object" && formTextAudio.size > 0
      ? URL.createObjectURL(formTextAudio)
      : formTextAudio || "";

  return (
    <div className="h-full flex flex-col justify-center items-center gap-x-2 mb-4">
      <p className="break-words">{form.getValues(`${field}.text`)}</p>

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
