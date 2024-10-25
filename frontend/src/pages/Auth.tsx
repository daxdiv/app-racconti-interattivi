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
import { useNavigate, useSearchParams } from "react-router-dom";
import { ModeToggle } from "@/components/ModeToggle";
import { useEffect } from "react";
import UserActions from "@/components/UserActions";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { UserPen } from "lucide-react";

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
  const { signIn } = useUser();

  const onSignIn = (values: AuthSchema) => {
    toast.promise(signIn.mutateAsync(values), {
      loading: "Caricamento...",
      success: () => {
        navigate("user/profile");

        return "Accesso effettuato correttamente";
      },
      error: ({ message }) => `Errore accesso \n ${message}`,
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
      <div className="absolute top-2 right-2 flex gap-x-1">
        <UserActions
          renderItems={() => (
            <>
              <DropdownMenuItem
                className="text-sm flex justify-between items-center cursor-pointer"
                onClick={() => {
                  navigate("/user/profile", { replace: true });
                }}
              >
                <UserPen size={15} /> Profilo
              </DropdownMenuItem>
            </>
          )}
        />
        <ModeToggle />
      </div>
      <div className="flex justify-center items-center h-screen min-h-screen">
        <Card className="w-1/3">
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
                          type="text"
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
                  className="w-full"
                >
                  Invia
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </>
  );
}

export default Auth;
