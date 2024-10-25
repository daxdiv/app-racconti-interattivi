import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogOut, UserPen, Users } from "lucide-react";

import type { Data } from "@/hooks/useUser";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import FlowForm from "@/components/user/flows/FlowForm";
import FlowsTable from "@/components/user/flows/FlowsTable";
import { ModeToggle } from "@/components/ModeToggle";
import UserActions from "@/components/UserActions";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useUser from "@/hooks/useUser";

type UserFlowsProps = {
  data: Data;
  isLoading: boolean;
};

function UserFlows(user: UserFlowsProps) {
  const navigate = useNavigate();
  const { signOut } = useUser();

  const handleSignOut = () => {
    toast.promise(signOut.mutateAsync(), {
      loading: "Disconnetto...",
      success: () => {
        navigate("/auth", { replace: true });

        return "Disconnesso correttamente";
      },
      error: "Errore durante la disconnessione",
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
                  navigate("/auth", { replace: true });
                }}
              >
                <Users size={15} /> Usa un altro account
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-sm flex justify-between items-center cursor-pointer"
                onClick={() => {
                  navigate("/user/profile", { replace: true });
                }}
              >
                <UserPen size={15} /> Profilo
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
        <Card className="border-none flex flex-col justify-center items-center w-2/3">
          <CardHeader>
            <CardTitle />
            <CardDescription />
          </CardHeader>
          <CardContent className="space-y-6">
            <FlowForm />

            {user.data.flows.length === 0 ? (
              <p className="flex justify-center items-center text-muted-foreground">
                Non hai creato nessun racconto
              </p>
            ) : (
              <FlowsTable {...user} />
            )}
          </CardContent>
          <CardFooter />
        </Card>
      </div>
    </>
  );
}

export default UserFlows;
