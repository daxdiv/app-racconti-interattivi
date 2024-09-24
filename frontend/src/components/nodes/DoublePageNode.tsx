import { Eye, Trash2, Unlink } from "lucide-react";
import {
  Handle,
  Position,
  useHandleConnections,
  type Node,
  type NodeProps,
} from "@xyflow/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Edit from "@/components/ui/nodes/doublePage/edit";
import Preview from "@/components/ui/nodes/doublePage/preview";
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
import { truncate } from "@/lib/utils";

type DoublePageNode = Node<DoublePageNodeData>;
type DoublePageNodeProps = NodeProps<DoublePageNode>;

function DoublePageNode(props: DoublePageNodeProps) {
  const sourceConnectionsLimit = props.data.choice !== undefined ? 2 : 1;
  const sourceConnections = useHandleConnections({ type: "source" });
  const { onNodeDelete, isNodeUnlinked } = useNodeUtils();

  const { id } = props;
  const { label } = props.data;

  return (
    <>
      {parseInt(id) !== 0 && (
        <Handle
          type="target"
          position={Position.Left}
          style={{ padding: "3px" }}
          isConnectableStart={false}
        />
      )}
      <Card className="w-[300px]">
        <CardHeader className="flex flex-row justify-between items-center space-y-0">
          <div className="flex justify-center items-center gap-x-2">
            <CardTitle>{truncate(label, 12)}</CardTitle>
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
            {parseInt(id) !== 0 && (
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
                    <TooltipContent>Elimina "{truncate(label, 12)}"</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Eliminare "{truncate(label, 12)}?</AlertDialogTitle>
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
          <Edit id={id} />
          <Preview
            id={id}
            data={props.data}
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
        </CardContent>
      </Card>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={sourceConnections.length < sourceConnectionsLimit}
        style={{ padding: "3px" }}
      />
    </>
  );
}

export default DoublePageNode;
