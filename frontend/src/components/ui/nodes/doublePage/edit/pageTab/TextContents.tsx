import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import type { PageSchema } from "@/lib/zod";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";

function TextContents() {
  const { control } = useFormContext<PageSchema>();

  return (
    <>
      <FormField
        control={control}
        name="label"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel className="font-extrabold text-md">Titolo</FormLabel>
            <FormControl>
              <Input
                placeholder="Questa storia parla di..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="mt-2 flex justify-between items-center gap-x-2">
        <FormField
          control={control}
          name="pages.0.text.content"
          render={({ field }) => (
            <FormItem className="w-1/2">
              <FormLabel className="font-extrabold text-md">
                Contenuto pagina sinistra
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="C'era una volta..."
                  className="h-[200px] min-h-[200px] max-h-[200px] text-black"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="pages.1.text.content"
          render={({ field }) => (
            <FormItem className="w-1/2">
              <FormLabel className="font-extrabold text-md">
                Contenuto pagina destra
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="...una bambina"
                  className="h-[200px] min-h-[200px] max-h-[200px] text-black"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}

export default TextContents;
