import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { usernameSchema, type UsernameSchema } from "@/lib/zod";

import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import useUser from "@/hooks/useUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

function UsernameForm() {
  const { me, setUsername } = useUser();
  const form = useForm<UsernameSchema>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: me.data?.username || "",
    },
  });

  const onSubmit = ({ username }: UsernameSchema) => {
    toast.promise(setUsername.mutateAsync({ username, userId: me.data!._id }), {
      loading: "Caricamento...",
      success: ({ message }) => message,
      error: ({ message }) => `Errore aggiornamento nome utente \n\t ${message}`,
    });
  };

  useEffect(() => {
    if (me.data) form.reset({ username: me.data.username });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me.data]);

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Nome utente</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  autoCapitalize="none"
                  autoComplete="username"
                  autoCorrect="off"
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
          disabled={form.formState.isSubmitting}
        >
          Modifica nome utente
        </Button>
      </form>
    </Form>
  );
}

export default UsernameForm;