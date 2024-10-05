import { BookOpen, LoaderCircle, LogOut, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useUser, { Data } from "@/hooks/useUser";

import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/ModeToggle";
import PasswordForm from "@/components/user/PasswordForm";
import { Separator } from "@/components/ui/separator";
import UserActions from "@/components/UserActions";
import UsernameForm from "@/components/user/UsernameForm";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// TODO quando elimino utente devo anche eliminare i flow collegati

type UserProfileProps = {
  data: Data;
  isLoading: boolean;
};

function UserProfile(user: UserProfileProps) {
  const navigate = useNavigate();
  const { signOut, deleteAccount } = useUser();

  const handleSignOut = () => {
    toast.promise(signOut.mutateAsync(), {
      loading: "Disconnetto...",
      success: () => {
        navigate("/", { replace: true });

        return "Disconnesso correttamente";
      },
      error: "Errore durante la disconnessione",
    });
  };
  const handleDeleteAccount = () => {
    toast.promise(deleteAccount.mutateAsync(user.data._id), {
      loading: "Elimino account...",
      success: () => {
        navigate("/", { replace: true });

        return "Account eliminato";
      },
      error: "Errore durante eliminazione account",
    });
  };

  return (
    <>
      <div className="flex justify-center items-center gap-x-1 absolute top-2 right-2">
        <UserActions
          renderItems={() => (
            <>
              <DropdownMenuItem
                className="text-sm flex justify-between items-center cursor-pointer"
                onClick={() => {
                  navigate("/", { replace: true });
                }}
              >
                <Users size={15} /> Usa un altro account
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm flex justify-between items-center cursor-pointer">
                <BookOpen size={15} /> I miei racconti
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-sm flex justify-between items-center cursor-pointer"
                onClick={handleSignOut}
              >
                <LogOut size={15} /> Esci
              </DropdownMenuItem>
            </>
          )}
        />
        <ModeToggle />
      </div>

      <div className="w-full h-screen flex justify-center items-center">
        <Card className="border-none flex-col justify-start w-1/3">
          <CardHeader>
            <CardTitle>Dati di accesso</CardTitle>
            <CardDescription />
          </CardHeader>
          <CardContent className="w-full space-y-6 justify-start">
            {user.isLoading ? (
              <LoaderCircle className="animate-spin text-white" />
            ) : (
              <>
                <UsernameForm />

                <PasswordForm />

                <Separator />

                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  className="w-full dark:text-primary hover:dark:bg-destructive-foreground"
                >
                  Elimina account
                </Button>
              </>
            )}
          </CardContent>
          <CardFooter />
        </Card>
      </div>
    </>
  );
}

export default UserProfile;
