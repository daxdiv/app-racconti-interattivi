import type { Node } from "@xyflow/react";

const INITIAL_PREVIEW_VALUE: DoublePageNodeData["preview"] = {
  label: "Titolo",
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
export const INITIAL_QUESTION_VALUE: DoublePageNodeData["question"] = {
  text: "",
  options: ["", ""],
  values: ["", ""],
  feedback: {
    list: [{ text: "" }, { text: "" }],
    option: "",
  },
};
export const INITIAL_QUESTION_PREVIEW_VALUE: DoublePageNodeData["preview"]["question"] = {
  text: "",
  audio: [new File([], ""), new File([], ""), new File([], "")],
  options: ["", ""],
  values: ["", ""],
  feedback: {
    list: [
      { text: "", audio: new File([], "") },
      { text: "", audio: new File([], "") },
    ],
    option: "",
  },
};
export const INITIAL_CHOICE_VALUE: DoublePageNodeData["choice"] = {
  text: "",
  options: ["", ""],
  values: ["", ""],
  feedback: {
    list: [{ text: "" }, { text: "" }],
    option: "",
  },
  nextSteps: [-1, -1],
};
export const INITIAL_CHOICE_PREVIEW_VALUE: DoublePageNodeData["preview"]["choice"] = {
  text: "",
  audio: [new File([], ""), new File([], ""), new File([], "")],
  options: ["", ""],
  values: ["", ""],
  feedback: {
    list: [
      { text: "", audio: new File([], "") },
      { text: "", audio: new File([], "") },
    ],
    option: "",
  },
  nextSteps: [-1, -1],
};

export const REACT_FLOW_PANE_CLASS = "react-flow__pane";
export const INITIAL_NODES: Node<DoublePageNodeData>[] = [
  {
    id: "0",
    type: "doublePage",
    data: {
      label: "Titolo",
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
export const MAX_FILE_SIZE = 2 * 1024 * 1024; // NOTE: 2MB
export const TOOLTIP_DELAY_DURATION = 400; // ms
export const MAX_TEXT_CONTENT_LENGTH = 900;
export const MAX_OPTION_LENGTH = 15;
export const MAX_VALUE_LENGTH = 15;
export const DEFAULT_BACKGROUND_URL =
  "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80";
