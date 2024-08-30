import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MAX_FILE_SIZE } from "@/constants";
import { useReactFlow, type Node } from "@xyflow/react";
import toast from "react-hot-toast";

type ChoiceFeedbackProps = {
  id: string;
  data: ChoiceNodeData;
  audiosURLs: [string, string];
};

function ChoiceFeedback({ id, data, audiosURLs }: ChoiceFeedbackProps) {
  const { updateNodeData } = useReactFlow<Node<ChoiceNodeData>>();

  return (
    <>
      <div className="flex justify-center items-center gap-x-2">
        <div className="flex-row justify-center items-center gap-x-2 w-1/2">
          <Label
            htmlFor="feedback-option-1"
            className="font-extrabold"
          >
            Feedback opzione
          </Label>
          <Input
            id="feedback-option-1"
            placeholder="Ben fatto!"
            value={data.preview.feedback.list[0].text}
            className="w-full"
            onChange={e => {
              const value = e.target.value;

              updateNodeData(id, ({ data }) => ({
                preview: {
                  ...data.preview,
                  feedback: {
                    ...data.preview.feedback,
                    list: [
                      {
                        text: value,
                        audio: data.preview.feedback.list[0].audio,
                      },
                      {
                        ...data.preview.feedback.list[1],
                      },
                    ],
                  },
                },
              }));
            }}
          />
        </div>

        <div className="flex-row justify-center items-center gap-x-2 w-1/2">
          <Label
            htmlFor="feedback-option-2"
            className="font-extrabold"
          >
            Feedback opzione
          </Label>
          <Input
            id="feedback-option-2"
            placeholder="Ben fatto!"
            value={data.preview.feedback.list[1].text}
            className="w-full"
            onChange={e => {
              const value = e.target.value;

              updateNodeData(id, ({ data }) => ({
                preview: {
                  ...data.preview,
                  feedback: {
                    ...data.preview.feedback,
                    list: [
                      { ...data.preview.feedback.list[0] },
                      {
                        text: value,
                        audio: data.preview.feedback.list[1].audio,
                      },
                    ],
                  },
                },
              }));
            }}
          />
        </div>
      </div>

      <div className="flex justify-center items-center gap-x-2">
        <div className="flex-row w-1/2">
          <Label
            htmlFor="audio-feedback-1"
            className="font-extrabold"
          >
            Audio primo feedback
          </Label>
          <Input
            id="audio-feedback-1"
            type="file"
            accept="audio/mp3"
            placeholder="Audio primo feedback"
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
                  feedback: {
                    ...data.preview.feedback,
                    list: [
                      {
                        ...data.preview.feedback.list[0],
                        audio: file,
                      },
                      { ...data.preview.feedback.list[1] },
                    ],
                  },
                },
              }));
            }}
          />
        </div>

        <div className="flex-row w-1/2">
          <Label
            htmlFor="audio-feedback-2"
            className="font-extrabold"
          >
            Audio secondo feedback
          </Label>
          <Input
            id="audio-feedback-2"
            type="file"
            accept="audio/mp3"
            placeholder="Audio secondo feedback"
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
                  feedback: {
                    ...data.preview.feedback,
                    list: [
                      { ...data.preview.feedback.list[0] },
                      {
                        ...data.preview.feedback.list[1],
                        audio: file,
                      },
                    ],
                  },
                },
              }));
            }}
          />
        </div>
      </div>

      {data.feedback.list.some(li => li.audio.size > 0) && (
        <div className="flex items-center gap-x-2">
          {data.feedback.list.map((li, i) =>
            li.audio.size > 0 ? (
              <div
                key={`feedback-audio-${li.audio.name}-${i}`}
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
                key={`feedback-audio-fallback-${i}`}
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

export default ChoiceFeedback;
