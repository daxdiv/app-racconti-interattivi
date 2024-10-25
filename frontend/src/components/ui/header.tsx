import { BookOpen, LogOut, UserPen, Users } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/ModeToggle";
import UserActions from "@/components/UserActions";
import toast from "react-hot-toast";
import { truncate } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import useUser from "@/hooks/useUser";

type HeaderProps = {
  label: string;
};

function Header({ label }: HeaderProps) {
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
    <header className="w-full h-[10vh] border-border/40 bg-black flex justify-between px-3 items-center">
      <div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <h1 className="scroll-m-20 font-bold tracking-tight text-2xl text-white">
                {truncate(label, 25)}
              </h1>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex justify-center items-center gap-x-1">
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
                  navigate("/user/flows", { replace: true });
                }}
              >
                <BookOpen size={15} /> I miei racconti
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
    </header>
  );
}

export default Header;
