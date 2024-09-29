import type { Node } from "@xyflow/react";

export const REACT_FLOW_PANE_CLASS = "react-flow__pane";
export const INITIAL_NODES: Node[] = [
  {
    id: "0",
    type: "doublePage",
    data: {},
    position: { x: 0, y: 50 },
  },
];
export const MAX_FILE_SIZE = 2 * 1024 * 1024; // NOTE: 2MB
export const TOOLTIP_DELAY_DURATION = 400; // ms
export const MAX_TEXT_CONTENT_LENGTH = 900;
export const MAX_QUESTION_CHOICE_TEXT_LENGTH = 20;
export const MAX_OPTION_LENGTH = 15;
export const MAX_VALUE_LENGTH = 15;
export const MAX_CONTINUE_OPTION_LENGTH = 15;
export const DEFAULT_BACKGROUND_URL =
  "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80";
