import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import type { PageSchema } from "@/lib/zod";
import { useFormContext } from "react-hook-form";
import { useNodeQueryContext } from "@/hooks/useNodeQueryContext";

type AudiosProps = {
  field: "question" | "choice";
};

function Audios({ field }: AudiosProps) {
  const { control } = useFormContext<PageSchema>();
  const { data, isLoading } = useNodeQueryContext();

  return (
    <>
      <div className="mt-2 flex justify-center items-center gap-x-2">
        <FormField
          control={control}
          name={`${field}.audio.1`}
          disabled={isLoading}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { value, onChange, ...rest } }) => (
            <FormItem className="w-full">
              <FormLabel className="flex justify-start items-center gap-x-2 font-extrabold text-md">
                Audio opzione 1
                {data?.[field] && (
                  <audio
                    controls
                    autoPlay={false}
                  >
                    <source
                      src={(data[field]?.audio[1] as string) || ""}
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
          name={`${field}.audio.2`}
          disabled={isLoading}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { value, onChange, ...rest } }) => (
            <FormItem className="w-full">
              <FormLabel className="flex justify-start items-center gap-x-2 font-extrabold text-md">
                Audio opzione 2
                {data?.[field] && (
                  <audio
                    controls
                    autoPlay={false}
                  >
                    <source
                      src={(data[field]?.audio[2] as string) || ""}
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
      </div>
    </>
  );
}

export default Audios;
