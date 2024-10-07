import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Feedbacks from "@/components/ui/nodes/doublePage/preview/questionChoiceTab/Feedbacks";
import Options from "@/components/ui/nodes/doublePage/preview/questionChoiceTab/Options";
import Text from "@/components/ui/nodes/doublePage/preview/questionChoiceTab/Text";

type QuestionChoiceTabProps = {
  field: "question" | "choice";
};

function QuestionChoiceTab({ field }: QuestionChoiceTabProps) {
  return (
    <>
      <Tabs defaultValue="preview-text-and-options">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="preview-text-and-options">Testo e opzioni</TabsTrigger>
          <TabsTrigger value="preview-first-feedback">Primo feedback</TabsTrigger>
          <TabsTrigger value="preview-second-feedback">Secondo feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="preview-text-and-options">
          <Text field={field} />
          <Options field={field} />
        </TabsContent>

        <TabsContent value="preview-first-feedback">
          <Feedbacks render="first" />
        </TabsContent>

        <TabsContent value="preview-second-feedback">
          <Feedbacks render="second" />
        </TabsContent>
      </Tabs>
    </>
  );
}

export default QuestionChoiceTab;
