import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import useNodeUtils from "@/hooks/useNodeUtils";
import { useReactFlow, type Node } from "@xyflow/react";

type PageTextPositionsProps = {
  id: string;
};

function PageTextPositions({ id }: PageTextPositionsProps) {
  const { getNodeData } = useNodeUtils();
  const { updateNodeData } = useReactFlow<Node<DoublePageNodeData>>();
  const data = getNodeData(id) as DoublePageNodeData;

  return (
    <div className="flex justify-center items-center gap-2">
      <div className="flex flex-col w-full gap-2">
        <Label
          htmlFor="pos"
          className="font-extrabold"
        >
          Posizione contenuto pagina {data.leftPageNumber}
        </Label>

        <Select
          defaultValue={data.pages[0].text.position}
          onValueChange={value => {
            updateNodeData(id, {
              preview: {
                ...data.preview,
                pages: [
                  {
                    text: {
                      ...data.preview.pages[0].text,
                      position: value as PageTextPosition,
                    },
                  },
                  data.preview.pages[1],
                ],
              },
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
          defaultValue={data.preview.pages[1].text.position}
          onValueChange={value => {
            updateNodeData(id, {
              preview: {
                ...data.preview,
                pages: [
                  data.preview.pages[0],
                  {
                    text: {
                      ...data.preview.pages[1].text,
                      position: value as PageTextPosition,
                    },
                  },
                ],
              },
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
  );
}

export default PageTextPositions;
