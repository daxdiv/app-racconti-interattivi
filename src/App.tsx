import "@xyflow/react/dist/style.css";
import "@/styles/globals.css";

import { Background, Controls, ReactFlow } from "@xyflow/react";
import { useMemo, useRef } from "react";

import DoublePageNode from "@/components/nodes/DoublePageNode";
import useReactFlowConnection from "@/hooks/useReactFlowConnection";

function App() {
  const nodeTypes = useMemo(() => ({ doublePage: DoublePageNode }), []);
  const reactFlowWrapper = useRef(null);
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onConnectStart,
    onConnectEnd,
  } = useReactFlowConnection();

  return (
    <div
      style={{ height: "100vh", width: "100vw" }}
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
      >
        <Background />
        <Controls
          orientation="horizontal"
          showInteractive={false}
        />
      </ReactFlow>
    </div>
  );
}

export default App;
