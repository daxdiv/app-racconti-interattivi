import "@xyflow/react/dist/style.css";
import "@/styles/globals.css";

import { Background, Controls, MiniMap, Panel, ReactFlow } from "@xyflow/react";
import { useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import ChoiceNode from "@/components/nodes/ChoiceNode";
import DeleteButtonEdge from "@/components/edges/DeleteButtonEdge";
import DoublePageNode from "@/components/nodes/DoublePageNode";
import Header from "@/components/ui/header";
import { Network } from "lucide-react";
import { SheetContextProvider } from "@/contexts/sheetContext";
import { Toaster } from "react-hot-toast";
import useReactFlowConnection from "@/hooks/useReactFlowConnection";

function App() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [defaultAccordionValue, setDefaultAccordionValue] =
    useState<DoublePageNodeLabel>("Pagine 1/2");
  const nodeTypes = useMemo(
    () => ({ doublePage: DoublePageNode, choice: ChoiceNode }),
    []
  );
  const edgeTypes = useMemo(() => ({ deleteButton: DeleteButtonEdge }), []);
  const reactFlowWrapper = useRef(null);
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onConnectStart,
    onConnectEnd,
    onLayout,
    isValidConnection,
  } = useReactFlowConnection();

  return (
    <SheetContextProvider
      value={{
        isSheetOpen,
        setIsSheetOpen,
        defaultAccordionValue,
        setDefaultAccordionValue,
      }}
    >
      <Header />
      <div
        style={{ height: "90vh", width: "100vw" }}
        ref={reactFlowWrapper}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          fitView
          fitViewOptions={{ padding: 2 }}
          nodeOrigin={[0.5, 0]}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          zoomOnScroll={false}
          panOnScroll
          maxZoom={1}
          isValidConnection={isValidConnection}
        >
          <Background />
          <Panel position="bottom-center">
            <Button
              className="flex justify-center items-center"
              onClick={() => onLayout("horizontal")}
            >
              <Network className="mr-2 nodrag nopan -rotate-90" />
              Ordina
            </Button>
          </Panel>
          <Controls
            orientation="horizontal"
            showInteractive={false}
          />
          <MiniMap
            pannable
            zoomable
          />
        </ReactFlow>
        <Toaster />
      </div>
    </SheetContextProvider>
  );
}

export default App;
