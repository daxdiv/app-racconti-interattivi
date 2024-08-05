import type { Node } from "@xyflow/react";

export const REACT_FLOW_PANE_CLASS = "react-flow__pane";
export const INITIAL_NODES: Node<DoublePageNodeData>[] = [
  {
    id: "0",
    type: "doublePage",
    data: {
      label: "Pagine 1/2",
      leftPageNumber: 1,
      rightPageNumber: 2,
      backgroundImage: "",
      pages: [
        {
          content: "",
          position: "TopLeft",
        },
        {
          content: "",
          position: "TopLeft",
        },
      ],
      audio: "",
      deletable: false,
    },
    position: { x: 0, y: 50 },
  },
];
