import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema, type AuthSchema } from "@/lib/zod";
import useUser from "@/hooks/useUser";
import toast from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ModeToggle } from "@/components/ModeToggle";
import { useEffect } from "react";

function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const form = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      type: "sign-in",
      username: "",
      password: "",
    },
  });
  const { signUp, signIn } = useUser();

  const onSignIn = (values: AuthSchema) => {
    toast.promise(signIn.mutateAsync(values), {
      loading: "Caricamento...",
      success: () => {
        navigate("/profile");

        return "Accesso effettuato correttamente";
      },
      error: ({ message }) => `Errore accesso \n ${message}`,
    });
  };
  const onSignUp = (values: AuthSchema) => {
    toast.promise(signUp.mutateAsync(values), {
      loading: "Caricamento...",
      success: () => {
        form.setValue("type", "sign-in");

        return "Utente creato";
      },
      error: ({ message }) => `Errore creazione utente \n ${message}`,
    });
  };

  useEffect(() => {
    const error = searchParams.get("error");

    if (error) {
      toast.error(error);
      searchParams.delete("error");
    }
  }, [searchParams]);

  return (
    <>
      <div className="absolute top-2 left-2 flex gap-x-1">
        <ModeToggle />
      </div>
      <div className="flex justify-center items-center h-screen min-h-screen">
        <Card className="w-1/3">
          <Tabs
            defaultValue="sign-in"
            onValueChange={v => {
              form.setValue("type", v as AuthSchema["type"]);
              form.clearErrors();
            }}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sign-in">Accedi</TabsTrigger>
              <TabsTrigger value="sign-up">Registrati</TabsTrigger>
            </TabsList>

            <TabsContent value="sign-in">
              <CardHeader>
                <CardTitle>Accedi</CardTitle>
                <CardDescription />
              </CardHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSignIn)}
                  noValidate
                >
                  <CardContent className="space-y-5 w-full">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Nome utente</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              autoCapitalize="none"
                              autoComplete="username"
                              autoCorrect="off"
                              placeholder="Inserisci il nome utente"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              autoCapitalize="none"
                              autoComplete="current-password"
                              autoCorrect="off"
                              placeholder="Inserisci la password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                    >
                      Invia
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="sign-up">
              <CardHeader>
                <CardTitle>Registrati</CardTitle>
                <CardDescription />
              </CardHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSignUp)}
                  noValidate
                >
                  <CardContent className="space-y-5 w-full">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Nome utente</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              autoCapitalize="none"
                              autoComplete="username"
                              autoCorrect="off"
                              placeholder="Inserisci il nome utente"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              autoCapitalize="none"
                              autoComplete="current-password"
                              autoCorrect="off"
                              placeholder="Inserisci la password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                    >
                      Invia
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </>
  );
}

export default Auth;
