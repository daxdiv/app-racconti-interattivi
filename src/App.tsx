import "@xyflow/react/dist/style.css";

import {
  Background,
  Controls,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Node,
  type Edge,
  type OnConnect,
  type OnConnectEnd,
  type OnConnectStart,
} from "@xyflow/react";
import { useCallback, useRef } from "react";

const initialNodes = [
  {
    id: "0",
    type: "input",
    data: { label: "Node" },
    position: { x: 0, y: 50 },
  },
];

let id = 1;
const getId = () => `${id++}`;

function App() {
  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef<null | string>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition } = useReactFlow();
  const onConnect: OnConnect = useCallback(params => {
    // reset the start node on connections
    connectingNodeId.current = null;
    setEdges(eds => addEdge(params, eds));
  }, []);

  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd: OnConnectEnd = useCallback(
    event => {
      if (!connectingNodeId.current) return;
      if (!event.target) return;

      const targetIsPane = (event.target as Element).classList.contains(
        "react-flow__pane"
      );

      if (targetIsPane) {
        const id = getId();
        const newNode: Node = {
          id,
          position: screenToFlowPosition({
            x: (event as MouseEvent).clientX,
            y: (event as MouseEvent).clientY,
          }),
          data: { label: `Node ${id}` },
          origin: [0.5, 0.0],
        };
        const newEgde: Edge = {
          id,
          source: connectingNodeId.current,
          target: id,
        };

        setNodes(nds => nds.concat(newNode));
        setEdges(eds => eds.concat(newEgde));
      }
    },
    [screenToFlowPosition]
  );

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
