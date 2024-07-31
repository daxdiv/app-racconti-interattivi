import "@xyflow/react/dist/style.css";

import { Background, Controls, ReactFlow } from "@xyflow/react";

import useReactFlowConnection from "@/hooks/useReactFlowConnection";
import { useRef } from "react";

function App() {
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
