import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Notebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReactFlow, type Node } from "@xyflow/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import useSheetContext from "@/hooks/useSheetContext";
import { DialogTitle } from "@/components/ui/dialog";

function Header() {
  const { isSheetOpen, setIsSheetOpen, defaultAccordionValue } = useSheetContext();
  const { getNodes } = useReactFlow<Node<DoublePageNodeData>>();

  return (
    <header className="w-full h-[10vh] border-border/40 bg-black flex justify-between px-3 items-center">
      <div>
        <h1 className="scroll-m-20 font-bold tracking-tight text-4xl text-white">
          Titolo
        </h1>
      </div>
      <div>
        <Sheet
          open={isSheetOpen}
          onOpenChange={setIsSheetOpen}
        >
          <SheetTrigger asChild>
            <Button
              variant="secondary"
              className="flex justify-center items-center"
            >
              <Notebook className="mr-2" />
              Riepilogo
            </Button>
          </SheetTrigger>
          <SheetContent>
            <DialogTitle>Riepilogo</DialogTitle>
            <Accordion
              type="single"
              collapsible
              className="w-full mt-2"
              defaultValue={defaultAccordionValue}
            >
              {getNodes().map(node => (
                <AccordionItem
                  value={node.data.label}
                  key={node.id}
                >
                  <div className="flex justify-start items-center gap-2">
                    <Avatar>
                      <AvatarImage
                        src=""
                        alt={`Sfondo pagine ${node.data.leftPageNumber}/${node.data.rightPageNumber}`}
                      />
                      <AvatarFallback>IMG</AvatarFallback>
                    </Avatar>
                    <AccordionTrigger>{node.data.label}</AccordionTrigger>
                  </div>
                  <AccordionContent>
                    {node.data.pages.map((page, index) => (
                      <p key={`${node.id}-page-${index + 1}`}>&#x2022; {page.content}</p>
                    ))}
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
