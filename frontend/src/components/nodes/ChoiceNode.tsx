import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Handle,
  Position,
  useHandleConnections,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

type ChoiceNode = Node<ChoiceNodeData>;
type ChoiceNodeProps = NodeProps<ChoiceNode>;

function ChoiceNode(props: ChoiceNodeProps) {
  const connections = useHandleConnections({ type: "source" });

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
      />
      <Card className="w-[300px] border-[1.5px] border-yellow-500">
        <CardHeader className="mb-0">
          <CardTitle className="text-xl">{props.data.label}</CardTitle>
          {/* <CardDescription>Nodo scelta</CardDescription> */}
        </CardHeader>

        <CardContent className="-mt-4 -mb-2">
          <Button
            variant="outline"
            className="w-full"
          >
            <Edit
              className="mr-2"
              size={16}
            />{" "}
            Modifica scelta
          </Button>
        </CardContent>
      </Card>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={connections.length < 2}
      />
    </>
  );
}

export default ChoiceNode;
