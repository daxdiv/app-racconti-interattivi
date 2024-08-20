import { Eye, Notebook, Trash2, Unlink, LoaderCircle } from "lucide-react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";

import useSheetContext from "@/hooks/useSheetContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditDialog from "@/components/ui/nodes/EditDialog";
import PreviewDialog from "@/components/ui/nodes/PreviewDialog";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TOOLTIP_DELAY_DURATION } from "@/constants";
import useNodeUtils from "@/hooks/useNodeUtils";
import useDownloadMedia from "@/hooks/useDownloadMedia";

type DoublePageNode = Node<DoublePageNodeData>;
type DoublePageNodeProps = NodeProps<DoublePageNode>;

function DoublePageNode(props: DoublePageNodeProps) {
  const { onNodeDelete, isNodeUnlinked } = useNodeUtils();
  const { setIsSheetOpen, setDefaultAccordionValue } = useSheetContext();

  const { id } = props;
  const { label, leftPageNumber, rightPageNumber, deletable } = props.data;

  const { backgroundImageQuery, audioQuery } = useDownloadMedia(id);

  return (
    <>
      {parseInt(id) !== 0 && (
        <Handle
          type="target"
          position={Position.Left}
        />
      )}
      <Card className="w-[300px]">
        <CardHeader className="flex flex-row justify-between items-center space-y-0">
          <div className="flex justify-center items-center gap-x-2">
            <CardTitle>{label}</CardTitle>
            {isNodeUnlinked(id) && (
              <TooltipProvider delayDuration={TOOLTIP_DELAY_DURATION}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Unlink
                      className="cursor-default text-primary py-1 px-1 rounded-full bg-yellow-500 hover:bg-yellow-500/70 nodrag nopan"
                      size={24}
                    />
                  </TooltipTrigger>
                  <TooltipContent>Nodo non collegato</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <div className="flex justify-center items-center gap-x-1">
            <TooltipProvider delayDuration={TOOLTIP_DELAY_DURATION}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Notebook
                    className="cursor-pointer text-secondary py-1 px-1 rounded-full bg-primary hover:bg-primary/70 nodrag nopan"
                    onClick={() => {
                      setIsSheetOpen(true);
                      setDefaultAccordionValue(props.data.label);
                    }}
                    size={24}
                  />
                </TooltipTrigger>
                <TooltipContent>Apri riepilogo</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {deletable && (
              <AlertDialog>
                <TooltipProvider delayDuration={TOOLTIP_DELAY_DURATION}>
                  <Tooltip>
                    <AlertDialogTrigger asChild>
                      <TooltipTrigger asChild>
                        <Trash2
                          className="cursor-pointer text-secondary p-1 rounded-full bg-destructive hover:bg-destructive/70 nodrag nopan"
                          size={24}
                        />
                      </TooltipTrigger>
                    </AlertDialogTrigger>
                    <TooltipContent>
                      Elimina pagine {leftPageNumber}/{rightPageNumber}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Eliminare pagine {leftPageNumber}/{rightPageNumber}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Una volta eliminate, dovrai ricrearle da zero.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction
                      onClick={() => {
                        onNodeDelete(id);
                      }}
                      className="bg-destructive hover:bg-destructive/70"
                    >
                      Si
                    </AlertDialogAction>
                    <AlertDialogCancel className="bg-primary hover:bg-primary/90 text-secondary hover:text-secondary">
                      No
                    </AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex justify-center items-center gap-x-1">
          {backgroundImageQuery.isLoading || audioQuery.isLoading ? (
            <>
              <div className="w-1/2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium">
                <LoaderCircle
                  className="animate-spin text-primary nodrag nopan"
                  size={24}
                />
              </div>
              <div className="w-1/2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium">
                <LoaderCircle
                  className="animate-spin text-primary nodrag nopan"
                  size={24}
                />
              </div>
            </>
          ) : (
            <>
              <EditDialog
                id={id}
                media={{
                  backgroundImage: backgroundImageQuery.data || "",
                  audio: audioQuery.data || "",
                }}
              />
              <PreviewDialog
                id={id}
                data={props.data}
                media={{
                  backgroundImage: backgroundImageQuery.data || "",
                  audio: audioQuery.data || "",
                }}
                trigger={
                  <Button
                    className="w-1/2"
                    variant="outline"
                  >
                    <Eye
                      className="mr-2"
                      size={16}
                    />{" "}
                    Anteprima
                  </Button>
                }
              />
            </>
          )}
        </CardContent>
      </Card>
      <Handle
        type="source"
        position={Position.Right}
      />
    </>
  );
}

export default DoublePageNode;
