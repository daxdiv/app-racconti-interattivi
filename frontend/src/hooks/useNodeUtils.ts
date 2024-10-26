import { getIncomers, getOutgoers, useReactFlow, type Node } from "@xyflow/react";
import toast from "react-hot-toast";
import { DEFAULT_DATA } from "@/constants";
import useFlow from "./useFlow";
import { useParams } from "react-router-dom";

function useNodeUtils() {
  const { save } = useFlow();
  const { flowId } = useParams();
  const { getNode, getNodes, getEdges, setNodes, deleteElements, getViewport } =
    useReactFlow<Node>();

  const onNodeDelete = (id: string) => {
    setNodes(prevNodes => {
      const updatedNodes = prevNodes.filter(node => node.id !== id);

      toast.promise(
        save.mutateAsync({
          nodes: updatedNodes,
          edges: getEdges(),
          viewport: getViewport(),
          flowId: flowId!,
        }),
        {
          loading: "Salvataggio in corso...",
          success: ({ message }) => message,
          error: ({ message }) => `Errore salvataggio racconto (${message})`,
        }
      );

      return updatedNodes;
    });
    deleteElements({
      nodes: [
        {
          id,
        },
      ],
    });
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

    setNodes(nds => {
      const updatedNodes = nds.concat(newNode);

      toast.promise(
        save.mutateAsync({
          nodes: updatedNodes,
          edges: getEdges(),
          viewport: getViewport(),
          flowId: flowId!,
        }),
        {
          loading: "Salvataggio in corso...",
          success: ({ message }) => message,
          error: ({ message }) => `Errore salvataggio racconto (${message})`,
        }
      );

      return updatedNodes;
    });
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
