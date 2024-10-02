import type { PageSchema } from "@/lib/zod";
import { useFormContext } from "react-hook-form";

type FeedbacksProps = {
  field: "question" | "choice";
};

function Feedbacks({ field }: FeedbacksProps) {
  const form = useFormContext<PageSchema>();
  const formFirstFeedbackAudio = form.watch("feedback.list.0.audio");
  const formSecondFeedbackAudio = form.watch("feedback.list.0.audio");
  const firstFeedbackAudio =
    typeof formFirstFeedbackAudio === "object" && formFirstFeedbackAudio.size > 0
      ? URL.createObjectURL(formFirstFeedbackAudio)
      : formFirstFeedbackAudio || "";
  const secondFeedbackAudio =
    typeof formSecondFeedbackAudio === "object" && formSecondFeedbackAudio.size > 0
      ? URL.createObjectURL(formSecondFeedbackAudio)
      : formSecondFeedbackAudio || "";
  const [firstFeedbackText, secondFeedbackText] = form.getValues([
    "feedback.list.0.text",
    "feedback.list.1.text",
  ]);

  return (
    <div className="flex flex-col justify-center items-center gap-x-5 mt-2">
      <div className="flex-col">
        <p className="font-extrabold">
          Feedback scegliendo "{form.getValues(`${field}.options.0`)}"
        </p>

        <div className="flex flex-col justify-center items-center">
          <p className="flex justify-center items-center gap-x-2 text-sm break-words">
            {firstFeedbackText}

            {firstFeedbackAudio ? (
              <audio
                controls
                autoPlay={false}
              >
                <source
                  src={firstFeedbackAudio as string}
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
      <div className="flex-col mt-3">
        <p className="font-extrabold">
          Feedback scegliendo "{form.getValues(`${field}.options.1`)}"
        </p>

        <div className="flex flex-col justify-center items-center">
          <p className="flex justify-center items-center gap-x-2 text-sm break-words">
            {secondFeedbackText}

            {secondFeedbackAudio ? (
              <audio
                controls
                autoPlay={false}
              >
                <source
                  src={secondFeedbackAudio as string}
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
    </div>
  );
}

export default Feedbacks;
