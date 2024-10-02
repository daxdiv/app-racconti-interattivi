import { AspectRatio } from "@/components/ui/aspect-ratio";
import { DEFAULT_BACKGROUND_URL } from "@/constants";
import type { PageSchema } from "@/lib/zod";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";

function PageTab() {
  const form = useFormContext<PageSchema>();
  const formBackground = form.watch("background");
  const background =
    typeof formBackground === "object" && formBackground.size > 0
      ? URL.createObjectURL(formBackground)
      : formBackground || DEFAULT_BACKGROUND_URL;
  const [leftPage, rightPage] = form.getValues("pages");

  return (
    <AspectRatio
      ratio={5 / 3}
      className="relative"
    >
      <img
        src={background as string}
        className="absolute rounded-md object-cover w-full h-full max-h-full"
      />
      <div className="absolute w-1/2 max-w-1/2 h-full border-r border-r-primary border-dashed">
        <p
          className={cn("whitespace-pre-line font-extrabold italic absolute max-w-full", {
            "top-10": leftPage.text.position.includes("Top"),
            "bottom-10": leftPage.text.position.includes("Bottom"),
            "left-10": leftPage.text.position.includes("Left"),
            "right-10": leftPage.text.position.includes("Right"),
            "top-1/2": leftPage.text.position.includes("Middle"),
          })}
        >
          {leftPage.text.content || "C'era una volta..."}
        </p>
      </div>

      <div className="absolute left-1/2 w-1/2 max-w-1/2 h-full">
        <p
          className={cn("whitespace-pre-line font-extrabold italic absolute max-w-full", {
            "top-10": rightPage.text.position.includes("Top"),
            "bottom-10": rightPage.text.position.includes("Bottom"),
            "left-10": rightPage.text.position.includes("Left"),
            "right-10": rightPage.text.position.includes("Right"),
            "top-1/2": rightPage.text.position.includes("Middle"),
          })}
        >
          {rightPage.text.content || "...una bambina..."}
        </p>
      </div>
    </AspectRatio>
  );
}

export default PageTab;
