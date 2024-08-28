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
      preview: INITIAL_PREVIEW_VALUE,
    },
    position: { x: 0, y: 50 },
  },
];
export const MAX_FILE_SIZE = 104_857_600; // NOTE: 100MB
export const TOOLTIP_DELAY_DURATION = 400; // ms
export const MAX_TEXT_CONTENT_LENGTH = 900;
