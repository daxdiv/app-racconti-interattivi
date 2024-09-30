import { useFormContext } from "react-hook-form";
import { useNodeQueryContext } from "@/hooks/useNodeQueryContext";

type FeedbacksProps = {
  field: "question" | "choice";
};

function Feedbacks({ field }: FeedbacksProps) {
  const { data } = useNodeQueryContext();
  const form = useFormContext();
  const formFirstFeedbackAudio = form.watch("feedbacks.list.0.audio");
  const formSecondFeedbackAudio = form.watch("feedbacks.list.0.audio");
  const firstFeedbackAudio =
    formFirstFeedbackAudio && formFirstFeedbackAudio.size > 0
      ? URL.createObjectURL(formFirstFeedbackAudio)
      : data?.feedback?.list[0].audio || "";
  const secondFeedbackAudio =
    formSecondFeedbackAudio && formSecondFeedbackAudio.size > 0
      ? URL.createObjectURL(formSecondFeedbackAudio)
      : data?.feedback?.list[1].audio || "";

  return (
    <div className="flex flex-col justify-center items-center gap-x-5 mt-2">
      <div className="flex-col">
        <p className="font-extrabold">
          Feedback scegliendo "{data?.[field]?.options[0]}"
        </p>

        <div className="flex flex-col justify-center items-center">
          <p className="flex justify-center items-center gap-x-2 text-sm break-words">
            {data?.feedback?.list[0].text}

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
          Feedback scegliendo "{data?.[field]?.options[1]}"
        </p>

        <div className="flex flex-col justify-center items-center">
          <p className="flex justify-center items-center gap-x-2 text-sm break-words">
            {data?.feedback?.list[1].text}

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
