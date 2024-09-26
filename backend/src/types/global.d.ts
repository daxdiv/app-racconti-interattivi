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
}

export {};
