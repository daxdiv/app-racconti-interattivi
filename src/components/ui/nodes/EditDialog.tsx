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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Volume2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PreviewDialog from "@/components/ui/nodes/PreviewDialog";
import { TOOLTIP_DELAY_DURATION } from "@/constants";
import { Textarea } from "@/components/ui/textarea";
import useNodeReducer from "@/hooks/useNodeReducer";
import useNodeUtils from "@/hooks/useNodeUtils";
import { useState } from "react";

type EditNodeDialogProps = {
  id: string;
  data: DoublePageNodeData;
};

function EditDialog({ id, data }: EditNodeDialogProps) {
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const { saveChanges } = useNodeUtils();
  const [nodeChanges, dispatch] = useNodeReducer(id);
  const currAudio = new Audio(nodeChanges.audio);

  return (
    <AlertDialog
      open={alertDialogOpen}
      onOpenChange={open => {
        if (!open) {
          currAudio.pause();
          currAudio.currentTime = 0;
        } else {
          dispatch({ payload: data, type: "UPDATE_ALL" });
        }

        setAlertDialogOpen(open);
      }}
    >
      <AlertDialogTrigger asChild>
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
      </AlertDialogTrigger>
      <AlertDialogContent
        className="max-w-3xl w-full"
        onEscapeKeyDown={e => {
          e.preventDefault();
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="flex justify-start items-center gap-2">
            Modifica pagine {data.leftPageNumber}/{data.rightPageNumber}{" "}
            <TooltipProvider delayDuration={TOOLTIP_DELAY_DURATION}>
              <Tooltip>
                <PreviewDialog {...nodeChanges} />
                <TooltipContent>
                  Visualizza anteprima pagine {data.leftPageNumber}/{data.rightPageNumber}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription />
        <div className="flex justify-center items-center gap-2">
          <Textarea
            placeholder={`Contenuto pagina ${data.leftPageNumber}`}
            className="h-[200px] min-h-[200px] max-h-[200px] text-black"
            value={nodeChanges.pages[0].text.content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              const value = e.target.value;

              dispatch({
                payload: {
                  page: "left",
                  content: value,
                },
                type: "TEXT_CONTENT_CHANGE",
              });
            }}
          />

          <Textarea
            placeholder={`Contenuto pagina ${data.rightPageNumber}`}
            className="h-[200px] min-h-[200px] max-h-[200px] text-black"
            value={nodeChanges.pages[1].text.content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              const value = e.target.value;

              dispatch({
                payload: {
                  page: "right",
                  content: value,
                },
                type: "TEXT_CONTENT_CHANGE",
              });
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
                dispatch({
                  payload: {
                    page: "left",
                    position: value as PageContentPosition,
                  },
                  type: "TEXT_POSITION_CHANGE",
                });
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
                dispatch({
                  payload: {
                    page: "right",
                    position: value as PageContentPosition,
                  },
                  type: "TEXT_POSITION_CHANGE",
                });
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
              onChange={e => {
                dispatch({ payload: e.target.files?.[0], type: "IMAGE_UPLOAD" });
              }}
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
              onChange={e => {
                dispatch({
                  payload: e.target.files?.[0],
                  type: "AUDIO_UPLOAD",
                  onReject: () => {
                    alert("Audio troppo grande");
                    e.target.files = null;
                    e.target.value = "";
                  },
                });
              }}
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
        <AlertDialogFooter>
          <AlertDialogAction
            className="bg-green-500 text-primary-foreground hover:bg-green-400"
            onClick={() => {
              if (JSON.stringify(data) === JSON.stringify(nodeChanges)) return;

              saveChanges(id, nodeChanges);
            }}
          >
            Salva
          </AlertDialogAction>

          {JSON.stringify(data) !== JSON.stringify(nodeChanges) ? ( // compare object
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button">Annulla</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Hai effettuato delle modifiche, uscire senza salvare?
                  </AlertDialogTitle>
                  <AlertDialogDescription />
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction
                    className="bg-destructive hover:bg-destructive/70"
                    onClick={() => setAlertDialogOpen(false)}
                  >
                    Si
                  </AlertDialogAction>
                  <AlertDialogCancel className="bg-primary hover:bg-primary/90 text-secondary hover:text-secondary">
                    No
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <AlertDialogCancel className="bg-primary hover:bg-primary/90 text-secondary hover:text-secondary">
              Annulla
            </AlertDialogCancel>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default EditDialog;
