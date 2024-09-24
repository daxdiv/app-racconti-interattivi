import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { MAX_VALUE_LENGTH } from "@/constants";
import { useReactFlow, type Node } from "@xyflow/react";

type ValuesProps = {
  id: string;
  data: DoublePageNodeData;
  field: "question" | "choice";
};

function Values({ id, data, field }: ValuesProps) {
  const { updateNodeData } = useReactFlow<Node<DoublePageNodeData>>();

  return (
    <div className="mt-2 flex justify-center items-center gap-x-2">
      <div className="flex-row w-1/2">
        <Label
          htmlFor="value-1"
          className="font-extrabold"
        >
          Primo valore
        </Label>
        <Input
          id="value-1"
          value={data.preview[field]?.values[0] || ""}
          placeholder="Sincerità"
          onChange={e => {
            const value = e.target.value;
            const spaceCount = (value.match(/ /g) || []).length;

            if (spaceCount > 0) {
              toast.error("I valori possono essere di massimo una parola");

              return;
            }
            if (value.length > MAX_VALUE_LENGTH) {
              toast.error(
                `I valori possono essere di massimo ${MAX_VALUE_LENGTH} caratteri`
              );

              return;
            }

            updateNodeData(id, ({ data }) => ({
              preview: {
                ...data.preview,
                [field]: {
                  ...data.preview[field],
                  values: [value, data.preview[field]?.values[1]],
                },
              },
            }));
          }}
        />
      </div>

      <div className="flex-row w-1/2">
        <Label
          htmlFor="value-2"
          className="font-extrabold"
        >
          Secondo valore
        </Label>
        <Input
          id="value-2"
          value={data.preview[field]?.values[1] || ""}
          placeholder="Cattiveria"
          onChange={e => {
            const value = e.target.value;
            const spaceCount = (value.match(/ /g) || []).length;

            if (spaceCount > 0) {
              toast.error("I valori possono essere di massimo una parola");

              return;
            }
            if (value.length > MAX_VALUE_LENGTH) {
              toast.error(
                `I valori possono essere di massimo ${MAX_VALUE_LENGTH} caratteri`
              );

              return;
            }

            updateNodeData(id, ({ data }) => ({
              preview: {
                ...data.preview,
                [field]: {
                  ...data.preview[field],
                  values: [data.preview[field]?.values[0], value],
                },
              },
            }));
          }}
        />
      </div>
    </div>
  );
}

export default Values;
