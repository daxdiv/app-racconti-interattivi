import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReactFlow, type Node } from "@xyflow/react";

type NodeSelectProps = {
  id: string;
  pageNumber: number;
};

function NodeSelect({ id, pageNumber }: NodeSelectProps) {
  const { getNode } = useReactFlow<Node<DoublePageNodeData>>();

  return (
    <Select
      defaultValue="TopLeft"
      onValueChange={value => {
        const nodeToUpdate = getNode(id);

        if (!nodeToUpdate) return;

        const nodeIndexToUpdate = pageNumber % 2 === 0 ? 1 : 0;

        nodeToUpdate.data.pages[nodeIndexToUpdate].position =
          value as PageContentPosition;
      }}
    >
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
  );
}

export default NodeSelect;
