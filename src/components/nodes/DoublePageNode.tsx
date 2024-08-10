import { Notebook, Trash2, Unlink } from "lucide-react";
import {
  Handle,
  Position,
  useReactFlow,
  getIncomers,
  getOutgoers,
  type Node,
  type NodeProps,
} from "@xyflow/react";

import useSheetContext from "@/hooks/useSheetContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditDialog from "@/components/nodes/ui/EditDialog";
import PreviewDialog from "@/components/nodes/ui/PreviewDialog";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { TOOLTIP_DELAY_DURATION } from "@/constants";
// import { decrementNodeId } from "@/hooks/useReactFlowConnection";

type DoublePageNode = Node<DoublePageNodeData>;
type DoublePageNodeProps = NodeProps<DoublePageNode>;

function DoublePageNode(props: DoublePageNodeProps) {
  const { setIsSheetOpen, setDefaultAccordionValue } = useSheetContext();
  const { getNodes, getEdges, setNodes, deleteElements } =
    useReactFlow<Node<DoublePageNodeData>>();

  const { id } = props;
  const { label, leftPageNumber, rightPageNumber, deletable } = props.data;
  const nodes = getNodes();
  const edges = getEdges();
  const incomers = getIncomers({ id }, nodes, edges);
  const outgoers = getOutgoers({ id }, nodes, edges);

  const onNodeDelete = () => {
    // decrementNodeId();
    URL.revokeObjectURL(props.data.backgroundImage);
    setNodes(prevNodes => prevNodes.filter(node => node.id !== props.id));
    deleteElements({
      nodes: [
        {
          id: props.id,
        },
      ],
    });
  };

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
      />
      <Card className="w-[300px]">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>{label}</CardTitle>
          <div className="flex justify-center items-center gap-x-1">
            {incomers.length === 0 && outgoers.length === 0 && (
              <TooltipProvider delayDuration={TOOLTIP_DELAY_DURATION}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Unlink
                      className="cursor-pointer text-primary py-1 px-1 rounded-full bg-yellow-500 hover:bg-yellow-500/70 nodrag nopan"
                      size={24}
                    />
                  </TooltipTrigger>
                  <TooltipContent>Nodo non collegato</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

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

            <TooltipProvider delayDuration={TOOLTIP_DELAY_DURATION}>
              <Tooltip>
                <PreviewDialog {...props.data} />
                <TooltipContent>
                  Visualizza anteprima pagine {leftPageNumber}/{rightPageNumber}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {deletable && (
              <TooltipProvider delayDuration={TOOLTIP_DELAY_DURATION}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Trash2
                      className="cursor-pointer text-secondary p-1 rounded-full bg-destructive hover:bg-destructive/70 nodrag nopan"
                      onClick={onNodeDelete}
                      size={24}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    Elimina pagine {leftPageNumber}/{rightPageNumber}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <EditDialog
            id={id}
            data={props.data}
          />
        </CardContent>
      </Card>
      <Handle
        type="source"
        position={Position.Bottom}
      />
    </>
  );
}

export default DoublePageNode;
