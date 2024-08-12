import { getIncomers, getOutgoers, useReactFlow, type Node } from "@xyflow/react";
import toast from "react-hot-toast";

function useNodeUtils() {
  const { getNode, getNodes, getEdges, setNodes, deleteElements, updateNodeData } =
    useReactFlow<Node<DoublePageNodeData>>();

  const onNodeDelete = (id: string) => {
    // decrementNodeId();
    // URL.revokeObjectURL(props.data.backgroundImage);
    // URL.revokeObjectURL(props.data.audio);
    setNodes(prevNodes => prevNodes.filter(node => node.id !== id));
    deleteElements({
      nodes: [
        {
          id,
        },
      ],
    });
    toast.error("Pagine eliminate", {
      duration: 3000,
    });
  };
  const isNodeUnlinked = (id: string) => {
    const nodes = getNodes();
    const edges = getEdges();
    const incomers = getIncomers({ id }, nodes, edges);
    const outgoers = getOutgoers({ id }, nodes, edges);

    return incomers.length === 0 && outgoers.length === 0;
  };
  const saveChanges = (id: string, data: DoublePageNodeData) => {
    const nodeToUpdate = getNode(id);

    if (!nodeToUpdate) return;

    updateNodeData(id, data);
    toast.success("Modifiche salvate con successo", {
      duration: 3000,
    });
  };

  return { onNodeDelete, isNodeUnlinked, saveChanges };
}

export default useNodeUtils;
