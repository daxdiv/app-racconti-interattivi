import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MAX_TEXT_CONTENT_LENGTH } from "@/constants";
import { useReactFlow, type Node } from "@xyflow/react";
import toast from "react-hot-toast";

type TextContentsProps = {
  id: string;
  data: DoublePageNodeData;
};

function TextContents({ id, data }: TextContentsProps) {
  const { updateNodeData } = useReactFlow<Node<DoublePageNodeData>>();

  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <div className="flex flex-col justify-center items-center w-full mb-3">
        <Label
          htmlFor="label"
          className="font-extrabold w-full mb-2"
        >
          Titolo
        </Label>
        <Input
          id="label"
          value={data.preview.label || ""}
          placeholder="Questa storia parla di..."
          className="w-full"
          onChange={e => {
            const value = e.target.value;

            updateNodeData(id, ({ data }) => ({
              preview: {
                ...data.preview,
                label: value,
              },
            }));
          }}
        />
      </div>

      <div className="flex justify-center items-center gap-x-2 w-full">
        <Textarea
          placeholder={"Contenuto pagina sinistra"}
          className="h-[200px] min-h-[200px] max-h-[200px] text-black"
          value={data.preview.pages[0].text.content}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const value = e.target.value;
            if (value.length > MAX_TEXT_CONTENT_LENGTH) {
              toast.error(
                `Il contenuto di una pagina può essere al massimo ${MAX_TEXT_CONTENT_LENGTH} caratteri`
              );
              return;
            }
            updateNodeData(id, {
              preview: {
                ...data.preview,
                pages: [
                  {
                    text: {
                      ...data.preview.pages[0].text,
                      content: value,
                    },
                  },
                  data.preview.pages[1],
                ],
              },
            });
          }}
        />
        <Textarea
          placeholder={"Contenuto pagina destra"}
          className="h-[200px] min-h-[200px] max-h-[200px] text-black"
          value={data.preview.pages[1].text.content}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const value = e.target.value;
            if (value.length > MAX_TEXT_CONTENT_LENGTH) {
              toast.error(
                `Il contenuto di una pagina può essere al massimo ${MAX_TEXT_CONTENT_LENGTH} caratteri`
              );
              return;
            }
            updateNodeData(id, {
              preview: {
                ...data.preview,
                pages: [
                  data.preview.pages[0],
                  {
                    text: {
                      ...data.preview.pages[1].text,
                      content: value,
                    },
                  },
                ],
              },
            });
          }}
        />
      </div>
    </div>
  );
}

export default TextContents;
