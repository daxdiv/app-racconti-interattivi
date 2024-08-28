import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useReactFlow, type Node } from "@xyflow/react";

type ChoiceLabelProps = {
  id: string;
  data: ChoiceNodeData;
};

function ChoiceLabel({ id, data }: ChoiceLabelProps) {
  const { updateNodeData } = useReactFlow<Node<ChoiceNodeData>>();

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
