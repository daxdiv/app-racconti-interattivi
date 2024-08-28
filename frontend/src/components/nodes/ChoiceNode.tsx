import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Handle,
  Position,
  useHandleConnections,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { Eye, Trash2, Unlink } from "lucide-react";
import useNodeUtils from "@/hooks/useNodeUtils";
import { TOOLTIP_DELAY_DURATION } from "@/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import EditChoiceDialog from "@/components/ui/nodes/choice/EditChoiceDialog";
import { truncate } from "@/lib/utils";
import PreviewChoiceDialog from "@/components/ui/nodes/choice/PreviewChoiceDialog";
import { Button } from "@/components/ui/button";

type ChoiceNode = Node<ChoiceNodeData>;
type ChoiceNodeProps = NodeProps<ChoiceNode>;

function ChoiceNode(props: ChoiceNodeProps) {
  const connections = useHandleConnections({ type: "source" });
  const { isNodeUnlinked, onNodeDelete, getNodeData } = useNodeUtils();

  const { id } = props;
  const { label } = props.data;

  const data = getNodeData(id) as ChoiceNodeData;

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{ padding: "3px" }}
        isConnectableStart={false}
      />
      <Card className="w-[300px] border-[1.5px] border-yellow-500">
        <CardHeader className="flex flex-row justify-between items-center space-y-0">
          <div className="flex justify-center items-center gap-x-2">
            <CardTitle>{truncate(label, 12)}</CardTitle>

            <CardDescription />

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
                  <TooltipContent>Elimina nodo scelta</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Eliminare nodo scelta "{label}"?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Una volta eliminato, dovrai ricrearlo da zero.
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
          </div>
        </CardHeader>

        <CardContent className="flex justify-center items-center gap-x-1">
          <EditChoiceDialog
            id={id}
            data={data}
          />
          <PreviewChoiceDialog
            id={id}
            data={data}
            trigger={
              <Button variant="outline">
                <Eye
                  className="mr-2"
                  size={16}
                />{" "}
                Anteprima
              </Button>
            }
          />
        </CardContent>
      </Card>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={connections.length < 2}
        style={{ padding: "3px" }}
      />
    </>
  );
}

export default ChoiceNode;
