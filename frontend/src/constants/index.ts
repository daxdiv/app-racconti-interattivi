import type { Node } from "@xyflow/react";
import type { PageSchema } from "@/lib/zod";
import { genId } from "@/lib/utils";

export const REACT_FLOW_PANE_CLASS = "react-flow__pane";
export const DEFAULT_BACKGROUND_URL =
  "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80";
export const DEFAULT_AUDIO_URL =
  "https://www.voanews.com/embed/player/0/6148249.html?type=audio";
export const DEFAULT_DATA: PageSchema = {
  type: "base",
  label: "Titolo",
  pages: [
    {
      text: {
        content: "C'era una volta...",
        position: "TopLeft",
      },
    },
    {
      text: {
        content: "...una bambina",
        position: "TopRight",
      },
    },
  ],
  background: DEFAULT_BACKGROUND_URL,
  audio: DEFAULT_AUDIO_URL,
};
export const INITIAL_NODES: Node<PageSchema>[] = [
  {
    id: genId(),
    type: "doublePage",
    data: DEFAULT_DATA,
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
export const MIN_USERNAME_LENGTH = 5;
export const MIN_PASSWORD_LENGTH = 8;
