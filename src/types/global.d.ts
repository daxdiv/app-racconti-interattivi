type HeightPosition = "Top" | "Middle" | "Bottom";
type WidthPosition = "Left" | "Center" | "Right";

declare global {
  type DoublePageNodeLabel = `Pagine ${number}/${number}`;
  interface DoublePageNodeData extends Record<string, unknown> {
    label: DoublePageNodeLabel;
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
