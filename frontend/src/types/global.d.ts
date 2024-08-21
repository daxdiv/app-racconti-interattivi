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
    readonly label: DoublePageNodeLabel;
    readonly leftPageNumber: number;
    readonly rightPageNumber: number;
    pages: [Page, Page];
    preview: {
      readonly label: DoublePageNodeLabel;
      readonly leftPageNumber: number;
      readonly rightPageNumber: number;
      backgroundImage: File;
      pages: [Page, Page];
      audio: File;
    };
  }
  interface DoublePageNodeDataWithoutPreview {
    readonly label: DoublePageNodeLabel;
    readonly leftPageNumber: number;
    readonly rightPageNumber: number;
    pages: [Page, Page];
  }
}

export {};
