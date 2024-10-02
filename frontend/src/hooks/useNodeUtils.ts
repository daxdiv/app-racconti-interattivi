import { getIncomers, getOutgoers, useReactFlow, type Node } from "@xyflow/react";
import toast from "react-hot-toast";
import { DEFAULT_DATA } from "@/constants";

function useNodeUtils() {
  const { getNode, getNodes, getEdges, setNodes, deleteElements } = useReactFlow<Node>();

  const onNodeDelete = (id: string) => {
    setNodes(prevNodes => prevNodes.filter(node => node.id !== id));
    deleteElements({
      nodes: [
        {
          id,
        },
      ],
    });
    toast.error("Nodo eliminato");
  };

  const onNodeCreate = (id: string) => {
    const initialNode = getNode("0")!;
    const newNode: Node = {
      id,
      data: DEFAULT_DATA,
      position: {
        x: initialNode.position.x - (Math.floor(Math.random() * 8) * 20 + 50),
        y: initialNode.position.y - (Math.floor(Math.random() * 8) * 20 + 50),
      },
      origin: [0.5, 0.0],
      type: "doublePage",
    };

    toast.success("Pagine create", { duration: 3000 });
    setNodes(nds => nds.concat(newNode));
  };
  const isNodeUnlinked = (id: string) => {
    const nodes = getNodes();
    const edges = getEdges();
    const incomers = getIncomers({ id }, nodes, edges);
    const outgoers = getOutgoers({ id }, nodes, edges);

    return incomers.length === 0 && outgoers.length === 0;
  };

  return {
    onNodeDelete,
    onNodeCreate,
    isNodeUnlinked,
    getNode,
  };
}

export default useNodeUtils;
