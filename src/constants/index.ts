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
      ],
      audio: "",
      deletable: false,
    },
    position: { x: 0, y: 50 },
  },
];
export const MAX_AUDIO_SIZE = 1024 * 1024;
