import type { PageSchema } from "@/lib/zod";
import { useFormContext } from "react-hook-form";

type FeedbacksProps = {
  render: "first" | "second";
};

function Feedbacks({ render }: FeedbacksProps) {
  const form = useFormContext<PageSchema>();
  const formFeedbackAudio = form.watch(
    `feedback.list.${render === "first" ? "0" : "1"}.audio`
  );
  const feedbackAudio =
    typeof formFeedbackAudio === "object" && formFeedbackAudio.size > 0
      ? URL.createObjectURL(formFeedbackAudio)
      : formFeedbackAudio || "";
  const feedbackText = form.getValues(
    `feedback.list.${render === "first" ? "0" : "1"}.text`
  );

  return (
    <div className="flex flex-col justify-center items-center gap-x-5 mt-2">
      <div className="flex flex-col justify-center items-center">
        <p className="flex flex-col justify-center items-center gap-x-2 text-sm break-words">
          {feedbackText}

          {feedbackAudio ? (
            <audio
              controls
              autoPlay={false}
            >
              <source
                src={feedbackAudio as string}
                type="audio/mp3"
              />
            </audio>
          ) : (
            <p className="flex justify-start items-center text-sm text-primary/70 ml-2">
              Nessun audio selezionato
            </p>
          )}
        </p>
        <div className="flex justify-center items-center bg-muted-foreground/65 rounded-full size-24 text-sm mt-2">
          Continuare
        </div>
      </div>
    </div>
  );
}

export default Feedbacks;
