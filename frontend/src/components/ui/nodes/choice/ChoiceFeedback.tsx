import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useReactFlow, type Node } from "@xyflow/react";

type ChoiceFeedbackProps = {
  id: string;
  data: ChoiceNodeData;
};

function ChoiceFeedback({ id, data }: ChoiceFeedbackProps) {
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

      <div className="flex-row justify-center items-center gap-x-2 w-1/2"></div>
    </>
  );
}

export default ChoiceFeedback;
