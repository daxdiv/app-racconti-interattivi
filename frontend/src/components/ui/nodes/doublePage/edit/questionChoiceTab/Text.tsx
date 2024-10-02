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
import { useNodeId } from "@xyflow/react";

type TextProps = {
  field: "question" | "choice";
};

function Text({ field }: TextProps) {
  const form = useFormContext<PageSchema>();
  const id = useNodeId();

  return (
    <div className="mt-2 flex flex-col">
      <div className="flex justify-center items-center gap-x-2">
        <FormField
          control={form.control}
          name={`${field}.audio.0`}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { value, onChange, ...rest } }) => (
            <FormItem className="w-full">
              <FormLabel className="flex justify-start items-center gap-x-2 font-extrabold text-md">
                Audio testo <FormMessage />
              </FormLabel>
              <FormControl>
                <Input
                  {...rest}
                  type="file"
                  accept="audio/mp3"
                  className="cursor-pointer"
                  onChange={event =>
                    onChange(
                      event.target.files &&
                        new File([event.target.files[0]], `${id}_${field}`)
                    )
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`${field}.text`}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="flex justify-start items-center gap-x-2 font-extrabold text-md">
                Testo <FormMessage />
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Cosa deve fare Cappuccetto Rosso quando..."
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

export default Text;
