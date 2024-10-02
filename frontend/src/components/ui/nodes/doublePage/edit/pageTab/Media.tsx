import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { PageSchema } from "@/lib/zod";
import { useFormContext } from "react-hook-form";
import { useNodeId } from "@xyflow/react";

function Media() {
  const form = useFormContext<PageSchema>();
  const id = useNodeId();

  return (
    <>
      <div className="mt-2 flex justify-center items-center gap-x-2">
        <FormField
          control={form.control}
          name="background"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { value, onChange, ...rest } }) => (
            <div className="flex flex-col justify-center items-center w-full space-y-4">
              <FormItem className="w-full">
                <FormLabel className="font-extrabold text-md">
                  Sfondo pagine{" "}
                  <span className="text-muted-foreground text-xs">
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
                      onChange(
                        event.target.files &&
                          new File([event.target.files[0]], `${id}_background`)
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="audio"
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
                      onChange(
                        event.target.files &&
                          new File([event.target.files[0]], `${id}_audio`)
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
          )}
        />
      </div>

      <p className="flex justify-start items-center text-sm gap-x-1 mt-6 ml-3 text-muted-foreground">
        <Info size={18} /> Per visualizzare sfondo e audio caricati in precedenza premere
        il pulsante "Anteprima"
      </p>
    </>
  );
}

export default Media;
