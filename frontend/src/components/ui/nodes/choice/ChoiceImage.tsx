import useNodeUtils from "@/hooks/useNodeUtils";
import { cn } from "@/lib/utils";
import { useReactFlow, type Node } from "@xyflow/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { MAX_FILE_SIZE } from "@/constants";
import toast from "react-hot-toast";

type ChoiceImageProps = {
  id: string;
  image: string;
};

function ChoiceImage({ id, image }: ChoiceImageProps) {
  const { getNodeData } = useNodeUtils();
  const { updateNodeData } = useReactFlow<Node<ChoiceNodeData>>();

  const data = getNodeData(id) as ChoiceNodeData;

  return (
    <div className="flex justify-center items-center gap-x-2">
      <div
        className={cn("flex-row w-full", {
          "w-1/2": data.image.size > 0,
        })}
      >
        <Label
          htmlFor="image"
          className="font-extrabold"
        >
          Immagine
        </Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          placeholder="Immagine"
          className="w-full cursor-pointer"
          onChange={e => {
            const file = e.target.files?.[0];

            if (!file) return;
            if (file.size > MAX_FILE_SIZE) {
              toast.error("Immagine troppo grande, non verrà usata");

              return;
            }

            updateNodeData(id, ({ data }) => ({
              ...data,
              preview: { ...data.preview, image: file },
            }));
          }}
        />
      </div>

      {data.image.size > 0 && (
        <div className="flex-row w-1/2">
          <Label
            htmlFor="old-image"
            className="font-extrabold"
          >
            Immagine attuale
          </Label>
          <Avatar
            id="old-image"
            className="rounded-none ml-2"
          >
            <AvatarImage src={image} />
          </Avatar>
        </div>
      )}
    </div>
  );
}

export default ChoiceImage;
