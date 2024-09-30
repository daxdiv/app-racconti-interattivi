import { Card, CardContent } from "@/components/ui/card";

import Feedbacks from "@/components/ui/nodes/doublePage/preview/questionChoiceTab/Feedbacks";
import Options from "@/components/ui/nodes/doublePage/preview/questionChoiceTab/Options";
import Text from "@/components/ui/nodes/doublePage/preview/questionChoiceTab/Text";
import Values from "./Values";

type QuestionChoiceTabProps = {
  field: "question" | "choice";
};

function QuestionChoiceTab({ field }: QuestionChoiceTabProps) {
  return (
    <Card className="h-full flex justify-center items-center">
      <CardContent className="flex flex-col justify-center items-center">
        <Text field={field} />

        <Options field={field} />

        <Values />

        <Feedbacks field={field} />
      </CardContent>
    </Card>
  );
}

export default QuestionChoiceTab;
