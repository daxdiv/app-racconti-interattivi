import "@xyflow/react/dist/style.css";
import "@/styles/globals.css";

import { Background, Controls, MiniMap, Panel, ReactFlow } from "@xyflow/react";
import { useMemo, useRef } from "react";

import { Button } from "@/components/ui/button";
import DeleteButtonEdge from "@/components/edges/DeleteButtonEdge";
import Header from "@/components/ui/header";
import { Network } from "lucide-react";
import { Toaster } from "react-hot-toast";
import WithNodeQuery from "@/components/nodes/DoublePageNode";
import useReactFlowConnection from "@/hooks/useReactFlowConnection";

function App() {
  const nodeTypes = useMemo(() => ({ doublePage: WithNodeQuery }), []);
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
    <>
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
    </>
  );
}

export default App;
