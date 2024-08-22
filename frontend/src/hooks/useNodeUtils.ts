import { getIncomers, getOutgoers, useReactFlow, type Node } from "@xyflow/react";
import toast from "react-hot-toast";

function useNodeUtils() {
  const { getNode, getNodes, getEdges, setNodes, deleteElements, updateNodeData } =
    useReactFlow<Node<DoublePageNodeData>>();

  const onNodeDelete = (id: string) => {
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
  const onNodeCreate = (id: number) => {
    const initialNode = getNode("0")!;
    const newNodePreview: DoublePageNodeData["preview"] = {
      label: `Pagine ${id + 1}/${id + 2}`,
      leftPageNumber: id + 1,
      rightPageNumber: id + 2,
      backgroundImage: new File([], ""),
      pages: [
        {
          text: {
            content: "",
            position: "TopLeft",
          },
        },
        {
          text: {
            content: "",
            position: "TopLeft",
          },
        },
      ] as [Page, Page],
      audio: new File([], ""),
    };
    const newNode: Node<DoublePageNodeData> = {
      id: `${id}`,
      data: {
        label: `Pagine ${id + 1}/${id + 2}`,
        leftPageNumber: id + 1,
        rightPageNumber: id + 2,
        pages: [
          {
            text: {
              content: "",
              position: "TopLeft",
            },
          },
          {
            text: {
              content: "",
              position: "TopLeft",
            },
          },
        ] as [Page, Page],
        preview: newNodePreview,
      },
      position: {
        x: initialNode.position.x - (Math.floor(Math.random() * 8) * 20 + 50),
        y: initialNode.position.y - (Math.floor(Math.random() * 8) * 20 + 50),
      },
      origin: [0.5, 0.0],
      type: "doublePage",
    };

    setNodes(nds => nds.concat(newNode));

    toast.success(`Pagine ${id + 1}/${id + 2} create`, { duration: 3000 });
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
    preview: Omit<DoublePageNodeData["preview"], "backgroundImage" | "audio">
  ) => {
    const dataKeys = Object.keys(preview) as (keyof DoublePageNodeData["preview"])[];
    const previewDataMap = dataKeys.reduce((acc, key) => {
      acc[key] = data[key];
      return acc;
    }, {} as Record<keyof DoublePageNodeData["preview"], unknown>);

    return JSON.stringify(previewDataMap) === JSON.stringify(preview);
  };

  return {
    onNodeDelete,
    onNodeCreate,
    isNodeUnlinked,
    getNode,
    getNodeData,
    updateNodeData,
    isNodeDataEqual,
  };
}

export default useNodeUtils;
