import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

type UserActionsProps = {
  renderItems: () => React.ReactNode | React.ReactNode[];
};

function UserActions({ renderItems }: UserActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          className="bg-secondary hover:bg-secondary/90 text-primary"
        >
          <User />
          <span className="sr-only">User actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>{renderItems()}</DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserActions;
