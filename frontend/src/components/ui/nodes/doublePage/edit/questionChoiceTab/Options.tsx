import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import type { PageSchema } from "@/lib/zod";
import { useFormContext } from "react-hook-form";
import { useNodeQueryContext } from "@/hooks/useNodeQueryContext";

type OptionProps = {
  field: "question" | "choice";
};

function Options({ field }: OptionProps) {
  const { control } = useFormContext<PageSchema>();
  const { isLoading } = useNodeQueryContext();

  return (
    <div className="mt-2 flex justify-center items-center gap-x-2">
      <FormField
        control={control}
        name={`${field}.options.0`}
        disabled={isLoading}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel className="font-extrabold text-md">Prima opzione</FormLabel>
            <FormControl>
              <Input
                placeholder="Parlare"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`${field}.options.1`}
        disabled={isLoading}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel className="font-extrabold text-md">Seconda opzione</FormLabel>
            <FormControl>
              <Input
                placeholder="Non parlare"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}

export default Options;
