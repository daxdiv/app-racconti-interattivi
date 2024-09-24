import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useHandleConnections, useReactFlow, type Node } from "@xyflow/react";
import Text from "@/components/ui/nodes/doublePage/edit/questionChoiceTab/Text";
import Options from "@/components/ui/nodes/doublePage/edit/questionChoiceTab/Options";
import Audios from "@/components/ui/nodes/doublePage/edit/questionChoiceTab/Audios";
import Feedbacks from "@/components/ui/nodes/doublePage/edit/questionChoiceTab/Feedbacks";
import {
  INITIAL_QUESTION_PREVIEW_VALUE,
  INITIAL_CHOICE_PREVIEW_VALUE,
} from "@/constants";
import toast from "react-hot-toast";
import Values from "@/components/ui/nodes/doublePage/edit/questionChoiceTab/Values";

type QuestionChoiceTabProps = {
  id: string;
  data: DoublePageNodeData;
  audios: {
    text: string | undefined;
    firstOption: string | undefined;
    secondOption: string | undefined;
    firstFeedback: string | undefined;
    secondFeedback: string | undefined;
  };
  field: "question" | "choice";
  disabled: boolean;
};

function QuestionChoiceTab({
  id,
  data,
  audios,
  field,
  disabled,
}: QuestionChoiceTabProps) {
  const [enable, setEnable] = useState(
    data[field] !== undefined ||
      data.preview[field] !== undefined ||
      Object.values(audios).some(Boolean)
  );
  const { updateNodeData } = useReactFlow<Node<DoublePageNodeData>>();
  const connections = useHandleConnections({ type: "source" });

  return (
    <>
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          <Label htmlFor="enable-question-choice">Abilita</Label>
          <Switch
            id="enable"
            disabled={disabled}
            checked={enable}
            onCheckedChange={() => {
              setEnable(e => {
                if (connections.length === 2) {
                  toast.error(
                    "Impossibile disabilitare scelta: rimuovere uno dei collegamenti in uscita da questo nodo"
                  );
                  return e;
                }

                // NOTE before disabling, reset
                if (e) {
                  updateNodeData(id, ({ data }) => ({
                    preview: {
                      ...data.preview,
                      [field]: undefined,
                    },
                  }));

                  return !e;
                }

                updateNodeData(id, ({ data }) => ({
                  preview: {
                    ...data.preview,
                    [field]:
                      field === "question"
                        ? data.question
                          ? data.question
                          : INITIAL_QUESTION_PREVIEW_VALUE
                        : data.choice
                        ? data.choice
                        : INITIAL_CHOICE_PREVIEW_VALUE,
                  },
                }));

                return !e;
              });
            }}
          />
        </div>
      </div>

      {enable && (
        <>
          <Text
            id={id}
            data={data}
            field={field}
            audio={audios.text}
          />

          <Options
            id={id}
            data={data}
            field={field}
          />

          <Values
            id={id}
            data={data}
            field={field}
          />

          <Audios
            id={id}
            field={field}
            audios={[audios.firstOption, audios.secondOption]}
          />

          <Feedbacks
            id={id}
            data={data}
            field={field}
            audios={[audios.firstFeedback, audios.secondFeedback]}
          />
        </>
      )}
    </>
  );
}

export default QuestionChoiceTab;
