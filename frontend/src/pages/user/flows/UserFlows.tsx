import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserPen, Users } from "lucide-react";

import type { Data } from "@/hooks/useUser";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import FlowForm from "@/components/user/flows/FlowForm";
import FlowsTable from "@/components/user/flows/FlowsTable";
import { ModeToggle } from "@/components/ModeToggle";
import UserActions from "@/components/UserActions";
import { useNavigate } from "react-router-dom";

type UserFlowsProps = {
  data: Data;
  isLoading: boolean;
};

function UserFlows(user: UserFlowsProps) {
  const navigate = useNavigate();

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
      <div className="w-full h-screen flex justify-center items-center">
        <Card className="border-none flex flex-col justify-center items-center w-2/3">
          <CardHeader>
            <CardTitle />
            <CardDescription />
          </CardHeader>
          <CardContent className="space-y-6">
            <FlowForm />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Oppure</span>
              </div>
            </div>

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
