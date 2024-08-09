type HeightPosition = "Top" | "Middle" | "Bottom";
type WidthPosition = "Left" | "Center" | "Right";

declare global {
  type DoublePageNodeLabel = `Pagine ${number}/${number}`;
  type PageContentPosition = `${HeightPosition}${WidthPosition}`;
  interface DoublePageNodeData extends Record<string, unknown> {
    label: DoublePageNodeLabel;
    leftPageNumber: number;
    rightPageNumber: number;
    backgroundImage: string;
    pages: [
      {
        text: {
          content: string;
          position: `${HeightPosition}${WidthPosition}`;
          class?: string;
        };
      },
      {
        text: {
          content: string;
          position: PageContentPosition;
          class?: string;
        };
      }
    ];
    audio: string;
    deletable: boolean;
  }
}

export {};
