import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { DoublePageNodeAction } from "@/hooks/useNodeReducer";
import { Label } from "@/components/ui/label";

type PageTextPositionsProps = {
  data: DoublePageNodeData;
  dispatch: React.Dispatch<DoublePageNodeAction>;
};

function PageTextPositions({
  data: { leftPageNumber, rightPageNumber, pages },
  dispatch,
}: PageTextPositionsProps) {
  return (
    <div className="flex justify-center items-center gap-2">
      <div className="flex flex-col w-full gap-2">
        <Label
          htmlFor="pos"
          className="font-extrabold"
        >
          Posizione contenuto pagina {leftPageNumber}
        </Label>

        <Select
          defaultValue={pages[0].text.position}
          onValueChange={value => {
            dispatch({
              payload: {
                page: "left",
                position: value as PageTextPosition,
              },
              type: "TEXT_POSITION_CHANGE",
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
          Posizione contenuto pagina {rightPageNumber}
        </Label>

        <Select
          defaultValue={pages[1].text.position}
          onValueChange={value => {
            dispatch({
              payload: {
                page: "right",
                position: value as PageTextPosition,
              },
              type: "TEXT_POSITION_CHANGE",
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
