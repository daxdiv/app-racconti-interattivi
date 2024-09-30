import Dagre from "@dagrejs/dagre";
import { useCallback, useEffect, useRef } from "react";
import {
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  getOutgoers,
  MarkerType,
  type Edge,
  type Node,
  type OnConnect,
  type OnConnectEnd,
  type OnConnectStart,
  type IsValidConnection,
} from "@xyflow/react";
import { INITIAL_NODES, REACT_FLOW_PANE_CLASS } from "@/constants";
import useSavedNodes from "@/hooks/useSavedNodes";

let nodeId = 0;
const incrementNodeId = () => (nodeId += 2);

function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  options: { direction: "horizontal" | "vertical" }
) {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

  g.setGraph({ rankdir: options.direction === "horizontal" ? "LR" : "TB" });

  edges.forEach(edge => g.setEdge(edge.source, edge.target));
  nodes.forEach(node =>
    g.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 0,
      height: node.measured?.height ?? 0,
    })
  );

  Dagre.layout(g);

  return {
    nodes: nodes.map(node => {
      const position = g.node(node.id);
      const x = position.x - (node.measured?.width ?? 0) / 2;
      const y = position.y - (node.measured?.height ?? 0) / 2;

      return { ...node, position: { x, y } };
    }),
    edges,
  };
}

export default function useReactFlowConnection() {
  const connectingNodeId = useRef<null | string>(null);
  const { data } = useSavedNodes();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { getNodes, getEdges, screenToFlowPosition, fitView } = useReactFlow();

  useEffect(() => {
    if (!data) return;

    setNodes(
      data.map(
        n =>
          ({
            id: n.id,
            position: {
              x: parseInt(n.x),
              y: parseInt(n.y),
            },
            data: {},
            type: "doublePage",
          } as Node)
      )
    );
  }, [data]);

  const onConnect: OnConnect = useCallback(params => {
    connectingNodeId.current = null;
    setEdges(eds =>
      addEdge(
        {
          ...params,
          animated: true,
          style: {
            stroke: "black",
            strokeWidth: 1,
          },
          type: "deleteButton",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 30,
            height: 30,
            color: "black",
          },
        },
        eds
      )
    );
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

      const newNodeId = incrementNodeId();
      const newNode: Node = {
        id: `${newNodeId}`,
        position: screenToFlowPosition({
          x: (event as MouseEvent).clientX,
          y: (event as MouseEvent).clientY,
        }),
        data: {},
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
        type: "deleteButton",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 30,
          height: 30,
          color: "black",
        },
      };

      setNodes(nds => nds.concat(newNode));
      setEdges(eds => eds.concat(newEgde));
    },
    [screenToFlowPosition]
  );

  const onLayout = useCallback(
    (direction: "horizontal" | "vertical") => {
      const layouted = getLayoutedElements(nodes, edges, { direction });

      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);

      window.requestAnimationFrame(() => {
        fitView();
      });
    },
    [nodes, edges]
  );

  const isValidConnection: IsValidConnection = useCallback(
    connection => {
      const nodes: Node[] = getNodes();
      const edges: Edge[] = getEdges();
      const target = nodes.find(node => node.id === connection.target);
      const hasCycle = (node: Node, visited = new Set()) => {
        if (visited.has(node.id)) return false;

        visited.add(node.id);

        for (const o of getOutgoers(node, nodes, edges)) {
          if (o.id === connection.source) return true;
          if (hasCycle(o, visited)) return true;
        }
      };

      if (!target) return false;
      if (target.id === connection.source) return false;

      return !hasCycle(target);
    },
    [getNodes, getEdges]
  );

  return {
    nodes,
    edges,
    setNodes,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onConnectStart,
    onConnectEnd,
    onLayout,
    isValidConnection,
  };
}
