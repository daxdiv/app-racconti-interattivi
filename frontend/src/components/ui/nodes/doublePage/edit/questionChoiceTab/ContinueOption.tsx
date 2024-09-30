import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import type { PageSchema } from "@/lib/zod";
import { useFormContext } from "react-hook-form";
import { useNodeQueryContext } from "@/hooks/useNodeQueryContext";

function ContinueOption() {
  const { control } = useFormContext<PageSchema>();
  const { isLoading } = useNodeQueryContext();

  return (
    <FormField
      control={control}
      name="feedback.option"
      disabled={isLoading}
      render={({ field }) => (
        <FormItem className="mt-2 w-full">
          <FormLabel className="font-extrabold text-md">Opzione per continuare</FormLabel>
          <FormControl>
            <Input
              type="text"
              className="cursor-pointer"
              placeholder="Continuare"
              {...field}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

export default ContinueOption;
