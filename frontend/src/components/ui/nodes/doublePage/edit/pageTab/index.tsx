import Media from "@/components/ui/nodes/doublePage/edit/pageTab/Media";
import TextContents from "@/components/ui/nodes/doublePage/edit/pageTab/TextContents";
import TextPositions from "@/components/ui/nodes/doublePage/edit/pageTab/TextPositions";

function PageTab() {
  return (
    <>
      <TextContents />

      <TextPositions />

      <Media />
    </>
  );
}

export default PageTab;
