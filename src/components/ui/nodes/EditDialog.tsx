import { useState } from "react";
import { Edit, Volume2 } from "lucide-react";
import { useReactFlow, type Node } from "@xyflow/react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import PreviewDialog from "@/components/ui/nodes/PreviewDialog";
import { MAX_AUDIO_SIZE, TOOLTIP_DELAY_DURATION } from "@/constants";
import { Tooltip, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type EditNodeDialogProps = {
  id: string;
  data: DoublePageNodeData;
};

function EditDialog({ id, data }: EditNodeDialogProps) {
  const { getNode, updateNodeData } = useReactFlow<Node<DoublePageNodeData>>();
  const [nodeChanges, setNodeChanges] = useState<DoublePageNodeData>(() => data);
  const currAudio = new Audio(nodeChanges.audio);

  const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedImage = e.target.files?.[0];

    if (!uploadedImage) return;

    URL.revokeObjectURL(nodeChanges.backgroundImage);

    const imageUrl = URL.createObjectURL(uploadedImage);

    setNodeChanges(prev => ({
      ...prev,
      backgroundImage: imageUrl,
    }));
  };

  const onAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedAudio = e.target.files?.[0];

    if (!uploadedAudio) return;
    if (uploadedAudio.size > MAX_AUDIO_SIZE) {
      alert("Audio troppo grande");
      e.target.files = null;
      e.target.value = "";

      return;
    }

    URL.revokeObjectURL(nodeChanges.audio);

    const audioUrl = URL.createObjectURL(uploadedAudio);

    setNodeChanges(prev => ({
      ...prev,
      audio: audioUrl,
    }));
  };

  const saveChanges = () => {
    const nodeToUpdate = getNode(id);

    if (!nodeToUpdate) return;

    updateNodeData(id, nodeChanges);
  };

  return (
    <Dialog
      onOpenChange={open => {
        if (!open) {
          currAudio.pause();
          currAudio.currentTime = 0;
        } else {
          setNodeChanges(data);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="w-full"
          variant="outline"
        >
          <Edit
            className="mr-2"
            size={16}
          />{" "}
          Modifica
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle className="flex justify-start items-center gap-2">
            Modifica pagine {data.leftPageNumber}/{data.rightPageNumber}{" "}
            <TooltipProvider delayDuration={TOOLTIP_DELAY_DURATION}>
              <Tooltip>
                <PreviewDialog {...nodeChanges} />
                <TooltipContent>
                  Visualizza anteprima pagine {data.leftPageNumber}/{data.rightPageNumber}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription />
        <div className="flex justify-center items-center gap-2">
          <Textarea
            placeholder={`Contenuto pagina ${data.leftPageNumber}`}
            className="h-[200px] min-h-[200px] max-h-[200px] text-black"
            value={nodeChanges.pages[0].text.content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              const value = e.target.value;

              setNodeChanges(prev => ({
                ...prev,
                pages: [
                  {
                    ...prev.pages[0],
                    text: {
                      ...prev.pages[0].text,
                      content: value,
                    },
                  },
                  prev.pages[1],
                ],
              }));
            }}
          />

          <Textarea
            placeholder={`Contenuto pagina ${data.rightPageNumber}`}
            className="h-[200px] min-h-[200px] max-h-[200px] text-black"
            value={nodeChanges.pages[1].text.content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              const value = e.target.value;

              setNodeChanges(prev => ({
                ...prev,
                pages: [
                  prev.pages[0],
                  {
                    ...prev.pages[1],
                    text: {
                      ...prev.pages[1].text,
                      content: value,
                    },
                  },
                ],
              }));
            }}
          />
        </div>

        <div className="flex justify-center items-center gap-2">
          <div className="flex flex-col w-full gap-2">
            <Label
              htmlFor="pos"
              className="font-extrabold"
            >
              Posizione contenuto pagina {data.leftPageNumber}
            </Label>

            <Select
              defaultValue={nodeChanges.pages[0].text.position}
              onValueChange={value => {
                setNodeChanges(prev => ({
                  ...prev,
                  pages: [
                    {
                      text: {
                        ...prev.pages[0].text,
                        position: value as PageContentPosition,
                      },
                    },
                    prev.pages[1],
                  ],
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Posizione contenuto" />
              </SelectTrigger>
              <SelectContent id="pos">
                <SelectItem value="TopLeft">Alto sinistra</SelectItem>
                <SelectItem value="TopRight">Alto destra</SelectItem>
                <SelectItem value="MiddleLeft">Centro sinistra</SelectItem>
                <SelectItem value="MiddleRight">Centro destra</SelectItem>
                <SelectItem value="BottomLeft">Basso sinistra</SelectItem>
                <SelectItem value="BottomRight">Basso destra</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col w-full gap-2">
            <Label
              htmlFor="pos"
              className="font-extrabold"
            >
              Posizione contenuto pagina {data.rightPageNumber}
            </Label>

            <Select
              defaultValue={nodeChanges.pages[1].text.position}
              onValueChange={value => {
                setNodeChanges(prev => ({
                  ...prev,
                  pages: [
                    prev.pages[0],
                    {
                      text: {
                        ...prev.pages[1].text,
                        position: value as PageContentPosition,
                      },
                    },
                  ],
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Posizione contenuto" />
              </SelectTrigger>
              <SelectContent id="pos">
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

        <div className="flex gap-2 w-full">
          <div className="flex flex-col w-full gap-2">
            <Label
              htmlFor="background"
              className="font-extrabold"
            >
              Sfondo pagine {data.leftPageNumber}/{data.rightPageNumber}
            </Label>
            <Input
              id="background"
              type="file"
              accept="image/*"
              className="cursor-pointer w-full"
              onChange={onImageUpload}
            />

            {data.backgroundImage !== "" && (
              <div className="flex justify-start items-center gap-2">
                <Label
                  htmlFor="selected-img"
                  className="font-extrabold ml-3"
                >
                  Sfondo attuale
                </Label>
                <Avatar
                  id="selected-img"
                  className="rounded-none"
                >
                  <AvatarImage src={data.backgroundImage || ""} />
                  <AvatarFallback>IMG</AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>

          <div className="flex flex-col w-full gap-2">
            <Label
              htmlFor="audio"
              className="font-extrabold"
            >
              Audio pagine {data.leftPageNumber}/{data.rightPageNumber}
            </Label>
            <Input
              id="audio"
              type="file"
              accept="audio/*"
              className="cursor-pointer w-full"
              onChange={onAudioUpload}
            />

            {data.audio !== "" && (
              <div className="flex justify-start items-center gap-2">
                <Label
                  htmlFor="selected-audio"
                  className="font-extrabold ml-3"
                >
                  Audio attuale
                </Label>
                <Button variant="ghost">
                  <Volume2
                    className="nodrag nopan"
                    onClick={() => {
                      currAudio.paused ? currAudio.play() : currAudio.pause();
                    }}
                  />
                </Button>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              className="bg-green-500 text-primary-foreground hover:bg-green-400"
              onClick={saveChanges}
            >
              Salva
            </Button>
          </DialogClose>

          {JSON.stringify(data) !== JSON.stringify(nodeChanges) ? ( // compare object
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button">Annulla</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Hai effettuato delle modifiche, vuoi salvarle?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <DialogClose
                    asChild
                    onClick={saveChanges}
                  >
                    <AlertDialogAction>Si</AlertDialogAction>
                  </DialogClose>
                  <DialogClose asChild>
                    <AlertDialogCancel>No</AlertDialogCancel>
                  </DialogClose>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <DialogClose asChild>
              <Button type="button">Annulla</Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditDialog;
