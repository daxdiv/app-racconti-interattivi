import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Handle, Position, useReactFlow } from "@xyflow/react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import NodeDialog from "./ui/NodeDialog";
import NodeSelect from "./ui/NodeSelect";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";

type DoublePageNodeProps = React.ComponentProps<typeof Card>;

function DoublePageNode(props: DoublePageNodeProps) {
  const { setNodes } = useReactFlow();

  const onNodeDelete = () => {
    setNodes(nodes => nodes.filter(node => node.id !== props.id));
  };

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
      />
      <Card {...props}>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Pagine x/y</CardTitle>
          <Trash2
            className="cursor-pointer text-secondary p-1 rounded-full bg-destructive"
            size={28}
            onClick={onNodeDelete}
          />
        </CardHeader>
        <CardContent className="grid">
          <div className="flex items-center justify-between">
            <div className="grid gap-2 grid-rows-2 mr-2">
              <NodeDialog pageNumber={1} />
              <NodeSelect />
            </div>
            <Separator orientation="vertical" />
            <div className="grid gap-2 grid-rows-2 ml-2">
              <NodeDialog pageNumber={2} />
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
