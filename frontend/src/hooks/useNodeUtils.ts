import { truncate } from "@/lib/utils";
import { getIncomers, getOutgoers, useReactFlow, type Node } from "@xyflow/react";
import toast from "react-hot-toast";

let choiceNodeId = 0;
const incrementChoiceNodeId = () => (choiceNodeId += 1);

type OnNodeCreateOptions =
  | { id: number; type: "doublePage" }
  | { label: string; type: "choice" };

function useNodeUtils() {
  const { getNode, getNodes, getEdges, setNodes, deleteElements } =
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
    toast.error("Nodo eliminato");
  };

  const onNodeCreate = (options: OnNodeCreateOptions) => {
    const initialNode = getNode("0")!;

    let newNode: Node<DoublePageNodeData | ChoiceNodeData>;

    switch (options.type) {
      case "doublePage":
        const { id } = options;
        const doublePageNodePreview: DoublePageNodeData["preview"] = {
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

        const doublePageNodeData: DoublePageNodeData = {
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
          preview: doublePageNodePreview,
        };

        newNode = {
          id: `${id}`,
          data: doublePageNodeData,
          position: {
            x: initialNode.position.x - (Math.floor(Math.random() * 8) * 20 + 50),
            y: initialNode.position.y - (Math.floor(Math.random() * 8) * 20 + 50),
          },
          origin: [0.5, 0.0],
          type: "doublePage",
        };

        toast.success(`Pagine ${id + 1}/${id + 2} create`, { duration: 3000 });

        break;
      case "choice":
        const { label } = options;
        const choiceNodeData: ChoiceNodeData = {
          label: label || "",
          image: new File([], ""),
          text: "",
          audio: [
            new File([], ""),
            new File([], ""),
            new File([], ""),
          ] as ChoiceNodeData["audio"],
          options: ["", ""] as ChoiceNodeData["options"],
          preview: {
            label: label || "",
            image: new File([], ""),
            text: "",
            audio: [
              new File([], ""),
              new File([], ""),
              new File([], ""),
            ] as ChoiceNodeData["audio"],
            options: ["", ""] as ChoiceNodeData["options"],
          },
        };

        newNode = {
          id: `choice-${choiceNodeId}`,
          data: choiceNodeData,
          position: {
            x: initialNode.position.x - (Math.floor(Math.random() * 8) * 20 + 50),
            y: initialNode.position.y - (Math.floor(Math.random() * 8) * 20 + 50),
          },
          origin: [0.5, 0.0],
          type: "choice",
        };

        incrementChoiceNodeId();

        toast.success(`Nodo scelta "${truncate(newNode.data.label, 12)}" creato`, {
          duration: 3000,
        });

        break;
    }

    setNodes(nds => nds.concat(newNode));
  };
  const isNodeUnlinked = (id: string) => {
    const nodes = getNodes();
    const edges = getEdges();
    const incomers = getIncomers({ id }, nodes, edges);
    const outgoers = getOutgoers({ id }, nodes, edges);

    return incomers.length === 0 && outgoers.length === 0;
  };
  const getNodeData = (id: string): DoublePageNodeData | ChoiceNodeData => {
    const node = getNode(id);

    if (!node) throw new Error("Nodo non trovato");

    return node.data;
  };

  return {
    onNodeDelete,
    onNodeCreate,
    isNodeUnlinked,
    getNode,
    getNodeData,
  };
}

export default useNodeUtils;
