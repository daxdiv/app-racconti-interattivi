import Media from "@/components/ui/nodes/doublePage/edit/pageTab/Media";
import TextContents from "@/components/ui/nodes/doublePage/edit/pageTab/TextContents";
import TextPositions from "@/components/ui/nodes/doublePage/edit/pageTab/TextPositions";
import useNodeUtils from "@/hooks/useNodeUtils";

type PageTabProps = {
  id: string;
};

function PageTab({ id }: PageTabProps) {
  const { getNodeData } = useNodeUtils();
  const data = getNodeData(id);

  return (
    <>
      <TextContents
        id={id}
        data={data}
      />

      <TextPositions
        id={id}
        data={data}
      />

      <Media
        id={id}
        data={data}
      />
    </>
  );
}

export default PageTab;
