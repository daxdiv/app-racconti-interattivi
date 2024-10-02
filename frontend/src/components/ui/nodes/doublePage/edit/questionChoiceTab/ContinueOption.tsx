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

function ContinueOption() {
  const form = useFormContext<PageSchema>();

  return (
    <FormField
      control={form.control}
      name="feedback.option"
      render={({ field }) => (
        <FormItem className="mt-2 w-full">
          <FormLabel className="flex justify-start items-center gap-x-2 font-extrabold text-md">
            Opzione per continuare <FormMessage />
          </FormLabel>
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
