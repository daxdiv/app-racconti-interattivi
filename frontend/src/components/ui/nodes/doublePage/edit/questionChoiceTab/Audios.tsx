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

type AudiosProps = {
  field: "question" | "choice";
};

function Audios({ field }: AudiosProps) {
  const form = useFormContext<PageSchema>();
  const id = useNodeId();

  return (
    <>
      <div className="mt-2 flex justify-center items-center gap-x-2">
        <FormField
          control={form.control}
          name={`${field}.audio.1`}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { value, onChange, ...rest } }) => (
            <FormItem className="w-full">
              <FormLabel className="flex justify-start items-center gap-x-2 font-extrabold text-md">
                Audio prima opzione <FormMessage />
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
                        new File([event.target.files[0]], `${id}_opt1`)
                    )
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`${field}.audio.2`}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { value, onChange, ...rest } }) => (
            <FormItem className="w-full">
              <FormLabel className="flex justify-start items-center gap-x-2 font-extrabold text-md">
                Audio seconda opzione <FormMessage />
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
                        new File([event.target.files[0]], `${id}_opt2`)
                    )
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
