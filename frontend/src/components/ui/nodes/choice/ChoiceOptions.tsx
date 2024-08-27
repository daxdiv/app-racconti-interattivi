import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import useNodeUtils from "@/hooks/useNodeUtils";
import { useReactFlow, type Node } from "@xyflow/react";
import toast from "react-hot-toast";

type ChoiceOptionsProps = { id: string };

function ChoiceOptions({ id }: ChoiceOptionsProps) {
  const { getNodeData } = useNodeUtils();
  const { updateNodeData } = useReactFlow<Node<ChoiceNodeData>>();

  const data = getNodeData(id) as ChoiceNodeData;

  return (
    <div className="flex justify-center items-center gap-x-2">
      <div className="flex-row w-1/2">
        <Label
          htmlFor="option-1"
          className="font-extrabold"
        >
          Prima opzione
        </Label>
        <Input
          id="option-1"
          value={data.preview.options[0]}
          placeholder="Parlarci"
          onChange={e => {
            const spaceCount = (e.target.value.match(/ /g) || []).length;

            if (spaceCount > 1) {
              toast.error("Le opzioni possono essere di massimo due parole");

              return;
            }

            updateNodeData(id, ({ data }) => ({
              ...data,
              preview: {
                ...data.preview,
                options: [e.target.value, data.preview.options[1]],
              },
            }));
          }}
        />
      </div>

      <div className="flex-row w-1/2">
        <Label
          htmlFor="option-2"
          className="font-extrabold"
        >
          Seconda opzione
        </Label>
        <Input
          id="option-2"
          value={data.preview.options[1]}
          placeholder="Non parlarci"
          onChange={e => {
            const spaceCount = (e.target.value.match(/ /g) || []).length;

            if (spaceCount > 1) {
              toast.error("Le opzioni possono essere di massimo due parole");

              return;
            }

            updateNodeData(id, ({ data }) => ({
              ...data,
              preview: {
                ...data.preview,
                options: [data.preview.options[0], e.target.value],
              },
            }));
          }}
        />
      </div>
    </div>
  );
}

export default ChoiceOptions;
