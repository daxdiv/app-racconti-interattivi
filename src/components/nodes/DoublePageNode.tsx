import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Handle, Position } from "@xyflow/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

type DoublePageNodeProps = React.ComponentProps<typeof Card>;

function DoublePageNode(props: DoublePageNodeProps) {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
      />
      <Card {...props}>
        <CardHeader>
          <CardTitle>Pagine x/y</CardTitle>
        </CardHeader>
        <CardContent className="grid">
          <div className="flex items-center justify-between">
            <div className="grid gap-2 grid-rows-2 mr-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Pagina x</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Contenuto pagina x</DialogTitle>
                    <DialogDescription>
                      <Textarea
                        placeholder="C'era una volta..."
                        className="max-h-[200px]"
                      />
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="secondary"
                      >
                        Salva
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Select>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Posizione contenuto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TopLeft">Alto sinistra</SelectItem>
                  <SelectItem value="TopRight">Alto destra</SelectItem>
                  <SelectItem value="MiddleLeft">Centro sinistra</SelectItem>
                  <SelectItem value="MiddleRight">Centro destra</SelectItem>
                  <SelectItem value="BottomLeft">Basso sinistra</SelectItem>
                  <SelectItem value="BottomRight">Basso destra</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator orientation="vertical" />
            <div className="grid gap-2 grid-rows-2 ml-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Pagina y</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Contenuto pagina y</DialogTitle>
                    <DialogDescription>
                      <Textarea
                        placeholder="C'era una volta..."
                        className="max-h-[200px]"
                      />
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="secondary"
                      >
                        Salva
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Select>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Posizione contenuto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TopLeft">Alto sinistra</SelectItem>
                  <SelectItem value="TopRight">Alto destra</SelectItem>
                  <SelectItem value="MiddleLeft">Centro sinistra</SelectItem>
                  <SelectItem value="MiddleRight">Centro destra</SelectItem>
                  <SelectItem value="BottomLeft">Basso sinistra</SelectItem>
                  <SelectItem value="BottomRight">Basso destra</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Separator />
          <div className="mt-4 flex justify-between items-center w-full text-xs">
            <div>
              <Label htmlFor="background">Sfondo</Label>
              <Input
                id="background"
                type="file"
                className="w-[200px]"
                accept="image/*"
              />
            </div>
            <div>
              <Label htmlFor="audio">Audio</Label>
              <Input
                id="audio"
                type="file"
                className="w-[200px]"
                accept="audio/*"
              />
            </div>
          </div>
        </CardFooter>
      </Card>
      <Handle
        type="source"
        position={Position.Bottom}
      />
    </>
  );
}

export default DoublePageNode;
