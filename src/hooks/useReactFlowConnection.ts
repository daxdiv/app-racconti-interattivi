import { useCallback, useRef } from "react";
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
import { INITIAL_NODES, REACT_FLOW_PANE_CLASS } from "@/constants";

// let nodeId = 0;
// export const incrementNodeId = () => (nodeId += 2);
// export const decrementNodeId = () => (nodeId -= 2);

export default function useReactFlowConnection() {
  const connectingNodeId = useRef<null | string>(null);
  const [nodes, setNodes, onNodesChange] =
    useNodesState<Node<DoublePageNodeData>>(INITIAL_NODES);
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

      // const newNodeId = incrementNodeId();
      const newNodeId = Number(connectingNodeId.current) + 2;
      const leftPageNumber = newNodeId + 1;
      const rightPageNumber = newNodeId + 2;
      const newNode: Node<DoublePageNodeData> = {
        id: `${newNodeId}`,
        position: screenToFlowPosition({
          x: (event as MouseEvent).clientX,
          y: (event as MouseEvent).clientY,
        }),
        data: {
          label: `Pagine ${leftPageNumber}/${rightPageNumber}`,
          leftPageNumber,
          rightPageNumber,
          backgroundImage: "",
          pages: [
            {
              text: {
                content: "",
                position: "TopLeft",
              },
            },
            {
              text: {
                content: "",
                position: "TopLeft",
              },
            },
          ],
          audio: "",
          deletable: true,
        },
        origin: [0.5, 0.0],
        type: "doublePage",
      };
      const newEgde: Edge = {
        id: `${newNodeId}`,
        source: connectingNodeId.current,
        target: `${newNodeId}`,
        animated: true,
        style: {
          stroke: "black",
          strokeWidth: 1,
        },
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
