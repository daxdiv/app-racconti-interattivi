import { Textarea } from "@/components/ui/textarea";
import useNodeUtils from "@/hooks/useNodeUtils";

type PageTextContentsProps = {
  id: string;
};

function PageTextContents({ id }: PageTextContentsProps) {
  const { getNodeData, updateNodeData } = useNodeUtils();
  const data = getNodeData(id);

  return (
    <div className="flex justify-center items-center gap-2">
      <Textarea
        placeholder={`Contenuto pagina ${data.leftPageNumber}`}
        className="h-[200px] min-h-[200px] max-h-[200px] text-black"
        value={data.preview.pages[0].text.content}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          const value = e.target.value;

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
        placeholder={`Contenuto pagina ${data.rightPageNumber}`}
        className="h-[200px] min-h-[200px] max-h-[200px] text-black"
        value={data.preview.pages[1].text.content}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          const value = e.target.value;

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
  );
}

export default PageTextContents;
