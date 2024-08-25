import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import useNodeUtils from "@/hooks/useNodeUtils";
import { useReactFlow, type Node } from "@xyflow/react";

type ChoiceLabelProps = {
  id: string;
};

function ChoiceLabel({ id }: ChoiceLabelProps) {
  const { getNodeData } = useNodeUtils();
  const { updateNodeData } = useReactFlow<Node<ChoiceNodeData>>();

  const data = getNodeData(id) as ChoiceNodeData;

  return (
    <>
      <Label
        htmlFor="label"
        className="font-extrabold"
      >
        Nome
      </Label>
      <Input
        id="label"
        value={data.preview.label}
        placeholder="Nome..."
        className="w-full"
        onChange={e => {
          updateNodeData(id, ({ data }) => ({
            ...data,
            preview: { ...data.preview, label: e.target.value },
          }));
        }}
      />
    </>
  );
}

export default ChoiceLabel;
