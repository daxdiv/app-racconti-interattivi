type HeightPosition = "Top" | "Middle" | "Bottom";
type WidthPosition = "Left" | "Center" | "Right";

declare global {
  type PageTextPosition = `${HeightPosition}${WidthPosition}`;
}

export {};
