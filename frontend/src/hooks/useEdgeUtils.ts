import { useReactFlow, type Node } from "@xyflow/react";
import toast from "react-hot-toast";

function useEdgeUtils() {
  const { setEdges, deleteElements } = useReactFlow<Node<DoublePageNodeData>>();

  const onEdgeDelete = (id: string) => {
    setEdges(edges => edges.filter(edge => edge.id !== id));
    deleteElements({
      edges: [{ id }],
    });
    toast.error("Collegamento eliminato");
  };

  return { onEdgeDelete };
}

export default useEdgeUtils;
