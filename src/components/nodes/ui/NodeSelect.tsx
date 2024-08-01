import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function NodeSelect() {
  return (
    <Select>
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
