import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import type { PageSchema } from "@/lib/zod";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { useNodeQueryContext } from "@/hooks/useNodeQueryContext";

type TextProps = {
  field: "question" | "choice";
};

function Text({ field }: TextProps) {
  const { control } = useFormContext<PageSchema>();
  const { data, isLoading } = useNodeQueryContext();

  return (
    <div className="mt-2 flex flex-col">
      <div className="flex justify-center items-center gap-x-2">
        <FormField
          control={control}
          name={`${field}.audio.0`}
          disabled={isLoading}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { value, onChange, ...rest } }) => (
            <FormItem className="w-full">
              <FormLabel className="flex justify-start items-center gap-x-2 font-extrabold text-md">
                Audio testo{" "}
                {data?.[field] && (
                  <audio
                    controls
                    autoPlay={false}
                  >
                    <source
                      src={(data[field]?.audio[0] as string) || ""}
                      type="audio/mp3"
                    />
                  </audio>
                )}
              </FormLabel>
              <FormControl>
                <Input
                  {...rest}
                  type="file"
                  accept="audio/mp3"
                  className="cursor-pointer"
                  onChange={event =>
                    onChange(event.target.files && event.target.files[0])
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`${field}.text`}
          disabled={isLoading}
          render={({ field }) => (
            <FormItem className={cn("w-full", { "mt-[0.35rem]": data })}>
              <FormLabel className="font-extrabold text-md">Testo</FormLabel>
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
