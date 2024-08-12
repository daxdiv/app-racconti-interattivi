type HeightPosition = "Top" | "Middle" | "Bottom";
type WidthPosition = "Left" | "Center" | "Right";

declare global {
  type DoublePageNodeLabel = `Pagine ${number}/${number}`;
  type PageTextPosition = `${HeightPosition}${WidthPosition}`;
  type Page = {
    text: {
      content: string;
      position: `${HeightPosition}${WidthPosition}`;
      class?: string;
    };
  };
  interface DoublePageNodeData extends Record<string, unknown> {
    label: DoublePageNodeLabel;
    leftPageNumber: number;
    rightPageNumber: number;
    backgroundImage: string;
    pages: [Page, Page];
    audio: string;
    deletable: boolean;
  }
}

export {};
