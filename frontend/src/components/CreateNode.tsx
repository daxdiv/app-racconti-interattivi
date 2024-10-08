import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { genId } from "@/lib/utils";
import useNodeUtils from "@/hooks/useNodeUtils";

function CreateNode() {
  const { onNodeCreate } = useNodeUtils();

  const handleClick = () => {
    const id = genId();
    onNodeCreate(id);
  };

  return (
    <Button
      className="flex justify-center items-center"
      onClick={handleClick}
    >
      <Plus className="mr-2" />
      Crea nodo
    </Button>
  );
}

export default CreateNode;
