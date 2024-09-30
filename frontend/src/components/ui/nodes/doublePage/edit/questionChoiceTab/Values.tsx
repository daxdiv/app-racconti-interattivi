import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import type { PageSchema } from "@/lib/zod";
import { useFormContext } from "react-hook-form";
import { useNodeQueryContext } from "@/hooks/useNodeQueryContext";

function Values() {
  const { control } = useFormContext<PageSchema>();
  const { isLoading } = useNodeQueryContext();

  return (
    <div className="mt-2 flex justify-center items-center gap-x-2">
      <FormField
        control={control}
        name="values.0"
        disabled={isLoading}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel className="font-extrabold text-md">Primo valore</FormLabel>
            <FormControl>
              <Input
                placeholder="Sincerità"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="values.1"
        disabled={isLoading}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel className="font-extrabold text-md">Secondo valore</FormLabel>
            <FormControl>
              <Input
                placeholder="Cattiveria"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}

export default Values;
