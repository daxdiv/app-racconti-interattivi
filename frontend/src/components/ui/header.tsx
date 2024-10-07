import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { ModeToggle } from "@/components/ModeToggle";
import { truncate } from "@/lib/utils";

type HeaderProps = {
  label: string;
};

function Header({ label }: HeaderProps) {
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

      <ModeToggle />
    </header>
  );
}

export default Header;
