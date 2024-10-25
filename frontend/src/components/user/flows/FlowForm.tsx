import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DEFAULT_AUDIO_URL, DEFAULT_BACKGROUND_URL } from "@/constants";
import useFlow from "@/hooks/useFlow";
import { baseSchema, type PageSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type FormValues = {
  label: string;
  nodes: Pick<PageSchema, "type" | "label" | "background" | "audio" | "pages">[];
};

const schema = z.object({
  label: z.string().min(1, "Il titolo del racconto non può essere vuoto"),
  nodes: z.array(baseSchema),
});

function FlowForm() {
  const { create } = useFlow();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    async defaultValues() {
      return {
        label: "",
        nodes: [
          {
            type: "base",
            label: "Titolo",
            background: DEFAULT_BACKGROUND_URL,
            audio: DEFAULT_AUDIO_URL,
            pages: [
              {
                text: {
                  content: "C'era una volta...",
                  position: "TopLeft",
                },
              },
              {
                text: {
                  content: "...una bambina",
                  position: "TopRight",
                },
              },
            ],
          },
        ],
      };
    },
  });

  console.log(form.formState.errors);
  const onSubmit = (values: FormValues) => {
    toast.promise(
      create.mutateAsync({
        label: values.label,
        nodes: [
          {
            id: "0",
            position: {
              x: 0,
              y: 50,
            },
            data: values.nodes[0],
          },
        ],
        edges: [],
      }),
      {
        loading: "Caricamento...",
        success: ({ message }) => message,
        error: ({ message }) => `Errore creazione racconto \n\t ${message}`,
      }
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titolo</FormLabel>
              <FormControl>
                <Input
                  placeholder="Cappuccetto rosso"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
        >
          Crea un nuovo racconto
        </Button>
      </form>
    </Form>
  );
}

export default FlowForm;
