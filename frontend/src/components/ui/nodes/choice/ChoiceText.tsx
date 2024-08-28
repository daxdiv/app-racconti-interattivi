import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useReactFlow, type Node } from "@xyflow/react";

type ChoiceTextProps = {
  id: string;
  data: ChoiceNodeData;
};

function ChoiceText({ id, data }: ChoiceTextProps) {
  const { updateNodeData } = useReactFlow<Node<ChoiceNodeData>>();

  return (
    <>
      <Label
        htmlFor="text"
        className="font-extrabold"
      >
        Domanda
      </Label>
      <Input
        id="text"
        value={data.preview.text}
        placeholder="Cosa deve fare Cappuccetto Rosso quando incontra il lupo?"
        className="w-full"
        onChange={e => {
          updateNodeData(id, ({ data }) => ({
            ...data,
            preview: { ...data.preview, text: e.target.value },
          }));
        }}
      />
    </>
  );
}

export default ChoiceText;
