import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useReactFlow, type Node } from "@xyflow/react";
import toast from "react-hot-toast";
import { MAX_OPTION_LENGTH } from "@/constants";

type ChoiceOptionsProps = { id: string; data: ChoiceNodeData };

function ChoiceOptions({ id, data }: ChoiceOptionsProps) {
  const { updateNodeData } = useReactFlow<Node<ChoiceNodeData>>();

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
            const value = e.target.value;
            const spaceCount = (value.match(/ /g) || []).length;

            if (spaceCount > 1) {
              toast.error("Le opzioni possono essere di massimo due parole");

              return;
            }
            if (value.length > MAX_OPTION_LENGTH) {
              toast.error(
                `Le opzioni possono essere di massimo ${MAX_OPTION_LENGTH} caratteri`
              );

              return;
            }

            updateNodeData(id, ({ data }) => ({
              ...data,
              preview: {
                ...data.preview,
                options: [value, data.preview.options[1]],
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
            const value = e.target.value;
            const spaceCount = (value.match(/ /g) || []).length;

            if (spaceCount > 1) {
              toast.error("Le opzioni possono essere di massimo due parole");

              return;
            }
            if (value.length > MAX_OPTION_LENGTH) {
              toast.error(
                `Le opzioni possono essere di massimo ${MAX_OPTION_LENGTH} caratteri`
              );

              return;
            }

            updateNodeData(id, ({ data }) => ({
              ...data,
              preview: {
                ...data.preview,
                options: [data.preview.options[0], value],
              },
            }));
          }}
        />
      </div>
    </div>
  );
}

export default ChoiceOptions;
