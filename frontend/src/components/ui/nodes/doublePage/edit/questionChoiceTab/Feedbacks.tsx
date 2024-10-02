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

function Feedbacks() {
  const form = useFormContext<PageSchema>();
  const id = useNodeId();

  return (
    <>
      <div className="mt-2 flex justify-center items-center gap-x-2">
        <FormField
          control={form.control}
          name="feedback.list.0.text"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="flex justify-start items-center gap-x-2 font-extrabold text-md">
                Feedback prima opzione <FormMessage />
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ben fatto"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="feedback.list.1.text"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="flex justify-start items-center gap-x-2 font-extrabold text-md">
                Feedback seconda opzione <FormMessage />
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Forse era meglio pensarci di più"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <div className="mt-2 flex justify-center items-center gap-x-2">
        <FormField
          control={form.control}
          name="feedback.list.0.audio"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { value, onChange, ...rest } }) => (
            <FormItem className="w-full">
              <FormLabel className="flex justify-start items-center gap-x-2 font-extrabold text-md">
                Audio primo feedback <FormMessage />
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
                        new File([event.target.files[0]], `${id}_feedback_opt1`)
                    )
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="feedback.list.1.audio"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { value, onChange, ...rest } }) => (
            <FormItem className="w-full">
              <FormLabel className="flex justify-start items-center gap-x-2 font-extrabold text-md">
                Audio secondo feedback <FormMessage />
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
                        new File([event.target.files[0]], `${id}_feedback_opt2`)
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

export default Feedbacks;
