import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";

import Audios from "@/components/ui/nodes/doublePage/edit/questionChoiceTab/Audios";
import ContinueOption from "@/components/ui/nodes/doublePage/edit/questionChoiceTab/ContinueOption";
import Feedbacks from "@/components/ui/nodes/doublePage/edit/questionChoiceTab/Feedbacks";
import Options from "@/components/ui/nodes/doublePage/edit/questionChoiceTab/Options";
import type { PageSchema } from "@/lib/zod";
import { Switch } from "@/components/ui/switch";
import Text from "@/components/ui/nodes/doublePage/edit/questionChoiceTab/Text";
import Values from "@/components/ui/nodes/doublePage/edit/questionChoiceTab/Values";
import toast from "react-hot-toast";
import { useFormContext } from "react-hook-form";
import { useHandleConnections } from "@xyflow/react";
import { useNodeQueryContext } from "@/hooks/useNodeQueryContext";

type QuestionChoiceTabProps = {
  field: "question" | "choice";
  disabled: boolean;
  onCheckedChange: (e: boolean) => void;
};

function QuestionChoiceTab({ field, disabled, onCheckedChange }: QuestionChoiceTabProps) {
  const { control } = useFormContext<PageSchema>();
  const { isLoading } = useNodeQueryContext();
  const connections = useHandleConnections({ type: "source" });

  return (
    <>
      <FormField
        control={control}
        name="type"
        disabled={isLoading}
        render={({ field: { value } }) => (
          <>
            <FormItem className="flex justify-start items-center gap-x-2">
              <FormLabel className="mt-2 font-extrabold text-md">Abilita</FormLabel>
              <FormControl>
                <Switch
                  checked={value === field}
                  disabled={disabled}
                  onCheckedChange={checked => {
                    if (connections.length === 2) {
                      toast.error(
                        "Impossibile disabilitare scelta: rimuovere uno dei collegamenti in uscita da questo nodo"
                      );

                      return onCheckedChange(false);
                    }

                    onCheckedChange(checked);
                  }}
                />
              </FormControl>
            </FormItem>

            {value === field && (
              <>
                <Text field={field} />

                <Options field={field} />

                <Values />

                <Audios field={field} />

                <Feedbacks field={field} />

                <ContinueOption />
              </>
            )}
          </>
        )}
      />
    </>
  );
}

export default QuestionChoiceTab;
