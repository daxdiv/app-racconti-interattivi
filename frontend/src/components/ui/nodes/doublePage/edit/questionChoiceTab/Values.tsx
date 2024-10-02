import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import type { PageSchema } from "@/lib/zod";
import { useFormContext } from "react-hook-form";

function Values() {
  const form = useFormContext<PageSchema>();

  return (
    <div className="mt-2 flex justify-center items-center gap-x-2">
      <FormField
        control={form.control}
        name="values.0"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel className="flex justify-start items-center gap-x-2 font-extrabold text-md">
              Primo valore <FormMessage />
            </FormLabel>
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
        control={form.control}
        name="values.1"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel className="flex justify-start items-center gap-x-2 font-extrabold text-md">
              Secondo valore <FormMessage />
            </FormLabel>
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
