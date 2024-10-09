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
    defaultValues: {
      label: "",
      nodes: [
        {
          type: "base",
          label: "Titolo",
          background: new File([], ""),
          audio: new File([], ""),
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
    },
  });

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
          {
            id: "end",
            position: {
              x: 400,
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

        <FormField
          control={form.control}
          name="nodes.0.background"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { value, onChange, ...rest } }) => (
            <FormItem>
              <FormLabel>
                Sfondo primo nodo{" "}
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
                        new File([event.target.files[0]], "0_background")
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nodes.0.audio"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { value, onChange, ...rest } }) => (
            <FormItem>
              <FormLabel>Audio primo nodo</FormLabel>
              <FormControl>
                <Input
                  {...rest}
                  type="file"
                  accept="audio/mp3"
                  className="cursor-pointer"
                  onChange={event =>
                    onChange(
                      event.target.files && new File([event.target.files[0]], "0_audio")
                    )
                  }
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
