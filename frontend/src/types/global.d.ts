type HeightPosition = "Top" | "Middle" | "Bottom";
type WidthPosition = "Left" | "Center" | "Right";

declare global {
  type PageTextPosition = `${HeightPosition}${WidthPosition}`;
  type Page = {
    text: {
      content: string;
      position: `${HeightPosition}${WidthPosition}`;
      class?: string;
    };
  };
  interface DoublePageNodeData extends Record<string, unknown> {
    label: string;
    readonly leftPageNumber: number;
    readonly rightPageNumber: number;
    pages: [Page, Page];
    question?: {
      text: string;
      options: [string, string];
      values: [string, string];
      feedback: {
        list: [{ text: string }, { text: string }];
        option: string;
      };
    };
    choice?: {
      text: string;
      options: [string, string];
      values: [string, string];
      feedback: {
        list: [{ text: string }, { text: string }];
        option: string;
      };
      nextSteps: [number, number];
    };
    preview: {
      label: string;
      readonly leftPageNumber: number;
      readonly rightPageNumber: number;
      backgroundImage: File;
      pages: [Page, Page];
      audio: File;
      question?: {
        text: string;
        audio: [File, File, File];
        options: [string, string];
        values: [string, string];
        feedback: {
          list: [{ text: string; audio: File }, { text: string; audio: File }];
          option: string;
        };
      };
      choice?: {
        text: string;
        audio: [File, File, File];
        options: [string, string];
        values: [string, string];
        feedback: {
          list: [{ text: string; audio: File }, { text: string; audio: File }];
          option: string;
        };
        nextSteps: [number, number];
      };
    };
  }

  interface DoublePageNodeDataWithoutPreview {
    readonly label: DoublePageNodeLabel;
    readonly leftPageNumber: number;
    readonly rightPageNumber: number;
    pages: [Page, Page];
    question?: {
      text: string;
      options: [string, string];
      values: [string, string];
      feedback: {
        list: [{ text: string }, { text: string }];
        option: string;
      };
    };
    choice?: {
      text: string;
      options: [string, string];
      values: [string, string];
      feedback: {
        list: [{ text: string }, { text: string }];
        option: string;
      };
      nextSteps: [number, number];
    };
  }
}

export {};
