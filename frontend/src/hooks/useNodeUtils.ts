import { getIncomers, getOutgoers, useReactFlow, type Node } from "@xyflow/react";
import toast from "react-hot-toast";

let choiceNodeId = 0;
const incrementChoiceNodeId = () => (choiceNodeId += 1);
const decrementChoiceNodeId = () => (choiceNodeId += 1);

function useNodeUtils() {
  const { getNode, getNodes, getEdges, setNodes, deleteElements, updateNodeData } =
    useReactFlow<Node<DoublePageNodeData | ChoiceNodeData>>();

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
  const onChoiceCreate = (label: string) => {
    const initialNode = getNode("0")!;
    const newChoiceNode: Node<ChoiceNodeData> = {
      id: `choice-${choiceNodeId}`,
      data: {
        label: label || "",
        image: new File([], ""),
        text: "",
        audio: [new File([], ""), new File([], ""), new File([], "")],
        options: ["", ""],
      },
      position: {
        x: initialNode.position.x - (Math.floor(Math.random() * 8) * 20 + 50),
        y: initialNode.position.y - (Math.floor(Math.random() * 8) * 20 + 50),
      },
      type: "choice",
    };

    setNodes(nds => nds.concat(newChoiceNode));
    incrementChoiceNodeId();
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

    return node.data as DoublePageNodeData;
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
    onChoiceCreate,
    choiceNodeId,
    incrementChoiceNodeId,
    decrementChoiceNodeId,
    isNodeUnlinked,
    getNode,
    getNodeData,
    updateNodeData,
    isNodeDataEqual,
  };
}

export default useNodeUtils;
