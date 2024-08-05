import { Notebook, Trash2 } from "lucide-react";
import { Handle, Position, useReactFlow, type Node, type NodeProps } from "@xyflow/react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import NodeDialog from "@/components/nodes/ui/NodeDialog";
import NodeSelect from "@/components/nodes/ui/NodeSelect";
import { Separator } from "@/components/ui/separator";
// import { decrementNodeId } from "@/hooks/useReactFlowConnection";

type DoublePageNode = Node<DoublePageNodeData>;
type DoublePageNodeProps = NodeProps<DoublePageNode>;

function DoublePageNode(props: DoublePageNodeProps) {
  const { setNodes, deleteElements } = useReactFlow();

  const { label, leftPageNumber, rightPageNumber, deletable } = props.data;
  const onNodeDelete = () => {
    // decrementNodeId();
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
      <Card {...props}>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>{label}</CardTitle>
          <div className="flex justify-center items-center gap-2">
            <Notebook
              className="cursor-pointer text-secondary py-1 px-1 rounded-full bg-primary nodrag nopan"
              size={28}
            />
            {deletable && (
              <Trash2
                className="cursor-pointer text-secondary p-1 rounded-full bg-destructive nodrag nopan"
                size={28}
                onClick={onNodeDelete}
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="grid">
          <div className="flex items-center justify-between">
            <div className="grid gap-2 grid-rows-2 mr-2">
              <NodeDialog pageNumber={leftPageNumber} />
              <NodeSelect />
            </div>
            <Separator orientation="vertical" />
            <div className="grid gap-2 grid-rows-2 ml-2">
              <NodeDialog pageNumber={rightPageNumber} />
              <NodeSelect />
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
