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
    toast.error("Nodo eliminato");
  };

  const onNodeCreate = (id: number) => {
    const initialNode = getNode("0")!;

    let newNode: Node<DoublePageNodeData>;

    const doublePageNodePreview: DoublePageNodeData["preview"] = {
      label: "Titolo",
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
      label: "Titolo",
      leftPageNumber: Number(id) + 1,
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
  const getNodeData = (id: string): DoublePageNodeData => {
    const node = getNode(id);

    if (!node) throw new Error("Nodo non trovato");

    return node.data;
  };
  const resetPreview = (id: string) => {
    const data = getNodeData(id);

    const defaultQuestionPreview: DoublePageNodeData["preview"]["question"] = {
      text: data.question?.text || "",
      audio: [new File([], ""), new File([], ""), new File([], "")],
      options: data.question?.options || ["", ""],
      values: data.question?.values || ["", ""],
      feedback: {
        list: [
          {
            text: data.question?.feedback.list[0].text || "",
            audio: new File([], ""),
          },
          {
            text: data.question?.feedback.list[1].text || "",
            audio: new File([], ""),
          },
        ],
        option: data.question?.feedback.option || "",
      },
    };
    const defaultChoicePreview: DoublePageNodeData["preview"]["choice"] = {
      text: data.choice?.text || "",
      audio: [new File([], ""), new File([], ""), new File([], "")],
      options: data.choice?.options || ["", ""],
      values: data.choice?.values || ["", ""],
      feedback: {
        list: [
          {
            text: data.choice?.feedback.list[0].text || "",
            audio: new File([], ""),
          },
          {
            text: data.choice?.feedback.list[1].text || "",
            audio: new File([], ""),
          },
        ],
        option: data.choice?.feedback.option || "",
      },
      nextSteps: data.choice?.nextSteps || [-1, -1],
    };

    updateNodeData(id, {
      preview: {
        label: data.label,
        leftPageNumber: data.leftPageNumber,
        rightPageNumber: data.rightPageNumber,
        backgroundImage: new File([], ""),
        pages: data.pages,
        audio: new File([], ""),
        question: data.question ? defaultQuestionPreview : undefined,
        choice: data.choice ? defaultChoicePreview : undefined,
      },
    });
  };

  return {
    onNodeDelete,
    onNodeCreate,
    isNodeUnlinked,
    getNode,
    getNodeData,
    resetPreview,
  };
}

export default useNodeUtils;
