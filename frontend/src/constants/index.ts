import type { Node } from "@xyflow/react";

const INITIAL_PREVIEW_VALUE: DoublePageNodeData["preview"] = {
  label: "Pagine 1/2" as DoublePageNodeLabel,
  leftPageNumber: 1,
  rightPageNumber: 2,
  backgroundImage: new File([], ""),
  pages: [
    {
      text: {
        content: "",
        position: "TopLeft" as PageTextPosition,
      },
    },
    {
      text: {
        content: "",
        position: "TopLeft" as PageTextPosition,
      },
    },
  ] as [Page, Page],
  audio: new File([], ""),
  deletable: false,
};

export const REACT_FLOW_PANE_CLASS = "react-flow__pane";
export const INITIAL_NODES: Node<DoublePageNodeData>[] = [
  {
    id: "0",
    type: "doublePage",
    data: {
      label: "Pagine 1/2",
      leftPageNumber: 1,
      rightPageNumber: 2,
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
      ],
      deletable: false,
      preview: INITIAL_PREVIEW_VALUE,
    },
    position: { x: 0, y: 50 },
  },
];
export const MAX_AUDIO_SIZE = 1024 * 1024;
export const TOOLTIP_DELAY_DURATION = 400; // ms
