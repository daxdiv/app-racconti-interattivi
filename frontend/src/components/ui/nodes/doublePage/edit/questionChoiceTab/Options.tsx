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

type OptionProps = {
  field: "question" | "choice";
};

function Options({ field }: OptionProps) {
  const form = useFormContext<PageSchema>();

  return (
    <div className="mt-2 flex justify-center items-center gap-x-2">
      <FormField
        control={form.control}
        name={`${field}.options.0`}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel className="flex justify-start items-center gap-x-2 font-extrabold text-md">
              Prima opzione <FormMessage />
            </FormLabel>
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
        control={form.control}
        name={`${field}.options.1`}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel className="flex justify-start items-center gap-x-2 font-extrabold text-md">
              Seconda opzione <FormMessage />
            </FormLabel>
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
