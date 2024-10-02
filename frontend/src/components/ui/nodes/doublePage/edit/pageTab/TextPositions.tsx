import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { PageSchema } from "@/lib/zod";
import { useFormContext } from "react-hook-form";

function TextPositions() {
  const { control } = useFormContext<PageSchema>();
  const form = useFormContext();

  return (
    <div className="mt-2 flex justify-center items-center gap-x-2">
      <FormField
        control={control}
        name="pages.0.text.position"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel className="font-extrabold text-md">
              Posizione contenuto pagina sinistra
            </FormLabel>
            <FormControl>
              <Select
                defaultValue={form.getValues("pages.0.text.position")}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Posizione contenuto" />
                </SelectTrigger>
                <SelectContent {...field}>
                  <SelectItem value="TopLeft">Alto sinistra</SelectItem>
                  <SelectItem value="TopRight">Alto destra</SelectItem>
                  <SelectItem value="MiddleLeft">Centro sinistra</SelectItem>
                  <SelectItem value="MiddleRight">Centro destra</SelectItem>
                  <SelectItem value="BottomLeft">Basso sinistra</SelectItem>
                  <SelectItem value="BottomRight">Basso destra</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="pages.1.text.position"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel className="font-extrabold text-md">
              Posizione contenuto pagina destra
            </FormLabel>
            <FormControl>
              <Select
                defaultValue={form.getValues("pages.1.text.position")}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Posizione contenuto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TopLeft">Alto sinistra</SelectItem>
                  <SelectItem value="TopRight">Alto destra</SelectItem>
                  <SelectItem value="MiddleLeft">Centro sinistra</SelectItem>
                  <SelectItem value="MiddleRight">Centro destra</SelectItem>
                  <SelectItem value="BottomLeft">Basso sinistra</SelectItem>
                  <SelectItem value="BottomRight">Basso destra</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export default TextPositions;
