import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import type { PageSchema } from "@/lib/zod";
import { useFormContext } from "react-hook-form";
import { useNodeQueryContext } from "@/hooks/useNodeQueryContext";

type FeedbacksProps = {
  field: "question" | "choice";
};

function Feedbacks({ field }: FeedbacksProps) {
  const { control } = useFormContext<PageSchema>();
  const { data, isLoading } = useNodeQueryContext();

  return (
    <>
      <div className="mt-2 flex justify-center items-center gap-x-2">
        <FormField
          control={control}
          name="feedback.list.0.text"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="font-extrabold text-md">
                Feedback prima opzione
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
          control={control}
          name="feedback.list.1.text"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="font-extrabold text-md">
                Feedback seconda opzione
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
          control={control}
          name="feedback.list.0.audio"
          disabled={isLoading}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { value, onChange, ...rest } }) => (
            <FormItem className="w-full">
              <FormLabel className="flex justify-start items-center gap-x-2 font-extrabold text-md">
                Audio feedback 1
                {data?.[field] && (
                  <audio
                    controls
                    autoPlay={false}
                  >
                    <source
                      src={(data.feedback?.list[0].audio as string) || ""}
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
          name="feedback.list.1.audio"
          disabled={isLoading}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { value, onChange, ...rest } }) => (
            <FormItem className="w-full">
              <FormLabel className="flex justify-start items-center gap-x-2 font-extrabold text-md">
                Audio feedback 2
                {data?.[field] && (
                  <audio
                    controls
                    autoPlay={false}
                  >
                    <source
                      src={(data.feedback?.list[1].audio as string) || ""}
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

export default Feedbacks;
