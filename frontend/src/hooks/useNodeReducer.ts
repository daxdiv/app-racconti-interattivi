import { Reducer, useReducer } from "react";
import { useReactFlow, type Node } from "@xyflow/react";
import { MAX_AUDIO_SIZE } from "@/constants";

export type DoublePageNodeAction =
  | {
      type: "IMAGE_UPLOAD";
      payload: File | undefined;
    }
  | { type: "AUDIO_UPLOAD"; payload: File | undefined; onReject: () => void }
  | {
      type: "TEXT_CONTENT_CHANGE";
      payload: { page: "left" | "right"; content: string };
    }
  | {
      type: "TEXT_POSITION_CHANGE";
      payload: { page: "left" | "right"; position: PageTextPosition };
    }
  | {
      type: "UPDATE_ALL";
      payload: DoublePageNodeData;
    };

function nodeReducer(
  state: DoublePageNodeData,
  action: DoublePageNodeAction
): ReturnType<Reducer<DoublePageNodeData, DoublePageNodeAction>> {
  switch (action.type) {
    case "IMAGE_UPLOAD": {
      if (!action.payload) return state;

      // URL.revokeObjectURL(state.backgroundImage);

      const imageUrl = URL.createObjectURL(action.payload);

      return {
        ...state,
        backgroundImage: imageUrl,
      };
    }
    case "AUDIO_UPLOAD": {
      if (!action.payload) return state;
      if (action.payload.size > MAX_AUDIO_SIZE) {
        action.onReject();
        return state;
      }

      // URL.revokeObjectURL(state.audio);

      const audioUrl = URL.createObjectURL(action.payload);

      return {
        ...state,
        audio: audioUrl,
      };
    }
    case "TEXT_CONTENT_CHANGE": {
      const pages: [Page, Page] =
        action.payload.page === "left"
          ? [
              {
                ...state.pages[0],
                text: {
                  ...state.pages[0].text,
                  content: action.payload.content,
                },
              },
              state.pages[1],
            ]
          : [
              state.pages[0],
              {
                ...state.pages[1],
                text: {
                  ...state.pages[1].text,
                  content: action.payload.content,
                },
              },
            ];

      return {
        ...state,
        pages,
      };
    }
    case "TEXT_POSITION_CHANGE": {
      const pages: [Page, Page] =
        action.payload.page === "left"
          ? [
              {
                ...state.pages[0],
                text: {
                  ...state.pages[0].text,
                  position: action.payload.position,
                },
              },
              state.pages[1],
            ]
          : [
              state.pages[0],
              {
                ...state.pages[1],
                text: {
                  ...state.pages[1].text,
                  position: action.payload.position,
                },
              },
            ];

      return {
        ...state,
        pages,
      };
    }
    case "UPDATE_ALL":
      return action.payload;
    default:
      return state;
  }
}

export default function useNodeReducer(id: string) {
  const { getNode } = useReactFlow<Node<DoublePageNodeData>>();
  const node = getNode(id);

  if (!node) throw new Error(`Node with id ${id} not found`);

  return useReducer(nodeReducer, node.data);
}
