import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

function Header() {
  return (
    <header className="w-full h-[10vh] border-border/40 bg-black flex justify-between px-3 items-center">
      <div>
        <h1 className="scroll-m-20 font-bold tracking-tight text-4xl text-white">
          Titolo
        </h1>
      </div>
      <div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="secondary"
              className="flex justify-center items-center"
            >
              <BookOpen className="mr-2" />
              Riepilogo
            </Button>
          </SheetTrigger>
          <SheetContent></SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export default Header;
