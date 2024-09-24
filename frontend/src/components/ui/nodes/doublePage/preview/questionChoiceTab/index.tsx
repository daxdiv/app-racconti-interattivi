import { Card, CardContent } from "@/components/ui/card";

import Feedbacks from "@/components/ui/nodes/doublePage/preview/questionChoiceTab/Feedbacks";
import Options from "@/components/ui/nodes/doublePage/preview/questionChoiceTab/Options";
import Text from "@/components/ui/nodes/doublePage/preview/questionChoiceTab/Text";
import Values from "./Values";

type QuestionChoiceTabProps = {
  data: DoublePageNodeDataWithoutPreview;
  audios: {
    text: string | undefined;
    firstOption: string | undefined;
    secondOption: string | undefined;
    firstFeedback: string | undefined;
    secondFeedback: string | undefined;
  };
  media?: {
    text: string;
    firstOption: string;
    secondOption: string;
    firstFeedback: string;
    secondFeedback: string;
  };
  field: "question" | "choice";
};

function QuestionChoiceTab({ data, media, audios, field }: QuestionChoiceTabProps) {
  return (
    <Card className="h-full flex justify-center items-center">
      <CardContent className="flex flex-col justify-center items-center">
        <Text
          data={data}
          field={field}
          audio={media?.text || audios.text}
        />

        <Options
          data={data}
          field={field}
          audios={[
            media?.firstOption || audios.firstOption,
            media?.secondOption || audios.secondOption,
          ]}
        />

        <Values
          data={data}
          field={field}
        />

        <Feedbacks
          data={data}
          field={field}
          audios={[
            media?.firstFeedback || audios.firstFeedback,
            media?.secondFeedback || audios.secondFeedback,
          ]}
        />
      </CardContent>
    </Card>
  );
}

export default QuestionChoiceTab;
