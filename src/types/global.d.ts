type HeightPosition = "Top" | "Middle" | "Bottom";
type WidthPosition = "Left" | "Center" | "Right";

declare global {
  interface DoublePageNodeData extends Record<string, unknown> {
    label: string;
    leftPageNumber: number;
    rightPageNumber: number;
    backgroundImage: string;
    pages: [
      text: {
        content: string;
        position: `${HeightPosition}${WidthPosition}`;
        class?: string;
      },
      text: {
        content: string;
        position: `${HeightPosition}${WidthPosition}`;
        class?: string;
      }
    ];
    audio: string;
    deletable: boolean;
  }
}

export {};
