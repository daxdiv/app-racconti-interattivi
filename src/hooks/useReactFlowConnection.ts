import {
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Edge,
  type Node,
  type OnConnect,
  type OnConnectEnd,
  type OnConnectStart,
} from "@xyflow/react";
import { useCallback, useRef } from "react";

const REACT_FLOW_PANE_CLASS = "react-flow__pane";
const INITIAL_NODE = [
  {
    id: "0",
    type: "doublePage",
    data: { label: "Node" },
    position: { x: 0, y: 50 },
  },
];

let id = 1;
const incrementId = () => `${id++}`;

export default function useReactFlowConnection() {
  const connectingNodeId = useRef<null | string>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(INITIAL_NODE);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect: OnConnect = useCallback(params => {
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
        REACT_FLOW_PANE_CLASS
      );

      if (!targetIsPane) return;

      const id = incrementId();
      const newNode: Node = {
        id,
        position: screenToFlowPosition({
          x: (event as MouseEvent).clientX,
          y: (event as MouseEvent).clientY,
        }),
        data: { label: `Node ${id}` },
        origin: [0.5, 0.0],
        type: "doublePage",
      };
      const newEgde: Edge = {
        id,
        source: connectingNodeId.current,
        target: id,
        type: "deleteButton",
      };

      setNodes(nds => nds.concat(newNode));
      setEdges(eds => eds.concat(newEgde));
    },
    [screenToFlowPosition]
  );

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onConnectStart,
    onConnectEnd,
  };
}
