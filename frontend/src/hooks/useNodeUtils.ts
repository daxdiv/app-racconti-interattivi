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
  const getNodeData = (id: string): DoublePageNodeData => {
    const node = getNode(id);

    if (!node) throw new Error("Nodo non trovato");

    return node.data;
  };
  const isNodeDataEqual = (
    data: DoublePageNodeData,
    preview: DoublePageNodeData["preview"]
  ) => {
    const dataKeys = Object.keys(preview) as (keyof DoublePageNodeData["preview"])[];
    const previewDataMap = dataKeys.reduce((acc, key) => {
      acc[key] = data[key];
      return acc;
    }, {} as Record<keyof DoublePageNodeData["preview"], unknown>);

    return JSON.stringify(previewDataMap) === JSON.stringify(preview);
  };

  return { onNodeDelete, isNodeUnlinked, getNodeData, updateNodeData, isNodeDataEqual };
}

export default useNodeUtils;
