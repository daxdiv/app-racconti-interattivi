import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PageSchema } from "@/lib/zod";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { useNodeQueryContext } from "@/hooks/useNodeQueryContext";

function Media() {
  const { data, isLoading } = useNodeQueryContext();
  const { control } = useFormContext<PageSchema>();

  return (
    <div className="mt-2 flex justify-center items-center gap-x-2">
      <FormField
        control={control}
        name="background"
        disabled={isLoading}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        render={({ field: { value, onChange, ...rest } }) => (
          <div
            className={cn("flex flex-col justify-center items-center w-full space-y-4", {
              "mt-2": data,
            })}
          >
            <FormItem className="w-full">
              <FormLabel className="font-extrabold text-md">
                Sfondo pagine{" "}
                <span className="text-muted-foreground/50 text-xs">
                  (dimensioni consigliate 1920x1080)
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  {...rest}
                  type="file"
                  accept="image/*"
                  className="cursor-pointer"
                  onChange={event =>
                    onChange(event.target.files && event.target.files[0])
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {data ? (
              <div className="flex justify-start items-center w-full gap-x-2 ml-2">
                <Label
                  htmlFor="selected-img"
                  className="font-extrabold ml-3"
                >
                  Sfondo attuale
                </Label>
                <Avatar
                  id="selected-img"
                  className="rounded-none"
                >
                  <AvatarImage src={data.background} />
                  <AvatarFallback>IMG</AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <p className="flex justify-start items-center text-sm text-primary/70 ml-2 w-full">
                Nessuno sfondo selezionato
              </p>
            )}
          </div>
        )}
      />
      <FormField
        control={control}
        name="audio"
        disabled={isLoading}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        render={({ field: { value, onChange, ...rest } }) => (
          <div className="flex flex-col justify-center items-center w-full space-y-4">
            <FormItem className="w-full">
              <FormLabel className="font-extrabold text-md">Audio pagine</FormLabel>
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
              <FormMessage />
            </FormItem>

            {data ? (
              <div className="flex justify-start items-center gap-x-2 w-full ml-2">
                <Label
                  htmlFor="selected-audio"
                  className="font-extrabold ml-3"
                >
                  Audio attuale
                </Label>
                <audio
                  id="selected-audio"
                  controls
                  autoPlay={false}
                >
                  <source
                    src={data.audio as string}
                    type="audio/mp3"
                  />
                </audio>
              </div>
            ) : (
              <p className="flex justify-start items-center text-sm text-primary/70 ml-2 w-full">
                Nessun audio selezionato
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
}

export default Media;
