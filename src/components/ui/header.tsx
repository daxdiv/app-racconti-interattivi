import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReactFlow } from "@xyflow/react";

function Header() {
  const { getNodes } = useReactFlow();

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
          <SheetContent>
            <Accordion
              type="single"
              collapsible
              className="w-full mt-2"
            >
              {getNodes().map(node => (
                <AccordionItem value={node.data.label as string}>
                  <AccordionTrigger>{node.data.label as string}</AccordionTrigger>
                  <AccordionContent>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla, est
                    dolor, non quasi architecto nostrum et enim magni in, beatae dicta
                    alias aspernatur provident delectus blanditiis pariatur. Itaque, magni
                    consectetur.
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export default Header;
