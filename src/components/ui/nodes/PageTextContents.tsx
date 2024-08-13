import type { DoublePageNodeAction } from "@/hooks/useNodeReducer";
import { Textarea } from "@/components/ui/textarea";

type PageTextContentsProps = {
  data: DoublePageNodeData;
  dispatch: React.Dispatch<DoublePageNodeAction>;
};

function PageTextContents({
  data: { leftPageNumber, rightPageNumber, pages },
  dispatch,
}: PageTextContentsProps) {
  return (
    <div className="flex justify-center items-center gap-2">
      <Textarea
        placeholder={`Contenuto pagina ${leftPageNumber}`}
        className="h-[200px] min-h-[200px] max-h-[200px] text-black"
        value={pages[0].text.content}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          const value = e.target.value;

          dispatch({
            payload: {
              page: "left",
              content: value,
            },
            type: "TEXT_CONTENT_CHANGE",
          });
        }}
      />

      <Textarea
        placeholder={`Contenuto pagina ${rightPageNumber}`}
        className="h-[200px] min-h-[200px] max-h-[200px] text-black"
        value={pages[1].text.content}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          const value = e.target.value;

          dispatch({
            payload: {
              page: "right",
              content: value,
            },
            type: "TEXT_CONTENT_CHANGE",
          });
        }}
      />
    </div>
  );
}

export default PageTextContents;
