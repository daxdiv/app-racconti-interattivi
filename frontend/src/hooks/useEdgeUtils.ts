import { useReactFlow, type Node } from "@xyflow/react";
import toast from "react-hot-toast";
import useFlow from "./useFlow";
import { useParams } from "react-router-dom";

function useEdgeUtils() {
  const { save } = useFlow();
  const { flowId } = useParams();
  const { getNodes, setEdges, deleteElements, getViewport } = useReactFlow<Node>();

  const onEdgeDelete = (id: string) => {
    setEdges(edges => {
      const updatedEdges = edges.filter(edge => edge.id !== id);

      toast.promise(
        save.mutateAsync({
          nodes: getNodes(),
          edges: updatedEdges,
          viewport: getViewport(),
          flowId: flowId!,
        }),
        {
          loading: "Salvataggio in corso...",
          success: ({ message }) => message,
          error: ({ message }) => `Errore salvataggio racconto (${message})`,
        }
      );

      return updatedEdges;
    });
    deleteElements({
      edges: [{ id }],
    });
    toast.error("Collegamento eliminato");
  };

  return { onEdgeDelete };
}

export default useEdgeUtils;
