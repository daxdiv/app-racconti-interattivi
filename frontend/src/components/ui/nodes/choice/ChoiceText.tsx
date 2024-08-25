import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import useNodeUtils from "@/hooks/useNodeUtils";
import { useReactFlow, type Node } from "@xyflow/react";

type ChoiceTextProps = {
  id: string;
};

function ChoiceText({ id }: ChoiceTextProps) {
  const { getNodeData } = useNodeUtils();
  const { updateNodeData } = useReactFlow<Node<ChoiceNodeData>>();

  const data = getNodeData(id) as ChoiceNodeData;

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
