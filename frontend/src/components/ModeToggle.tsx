import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Palette, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import useTheme from "@/hooks/useTheme";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          className="bg-secondary text-primary hover:bg-secondary/90"
        >
          <Palette />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-36"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="text-sm flex justify-between items-center cursor-pointer"
        >
          <Sun size={15} /> Tema chiaro
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="text-sm flex justify-between items-center cursor-pointer"
        >
          <Moon size={15} /> Tema scuro
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
