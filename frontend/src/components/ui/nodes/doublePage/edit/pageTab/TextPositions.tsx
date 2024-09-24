import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { useReactFlow, type Node } from "@xyflow/react";

type TextPositionsProps = {
  id: string;
  data: DoublePageNodeData;
};

function TextPositions({ id, data }: TextPositionsProps) {
  const { updateNodeData } = useReactFlow<Node<DoublePageNodeData>>();

  return (
    <div className="mt-3 flex justify-center items-center gap-2">
      <div className="flex flex-col w-full gap-2">
        <Label
          htmlFor="pos"
          className="font-extrabold"
        >
          Posizione contenuto pagina sinistra
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
          Posizione contenuto pagina destra
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

export default TextPositions;
