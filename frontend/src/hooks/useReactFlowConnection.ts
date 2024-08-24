import Dagre from "@dagrejs/dagre";
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

let nodeId = 0;
const incrementNodeId = () => (nodeId += 2);

function getLayoutedElements(
  nodes: (Node<DoublePageNodeData> | Node<ChoiceNodeData>)[],
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
  const [nodes, setNodes, onNodesChange] = useNodesState<
    Node<DoublePageNodeData> | Node<ChoiceNodeData>
  >(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition, fitView } = useReactFlow();

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
      const leftPageNumber = newNodeId + 1;
      const rightPageNumber = newNodeId + 2;
      const preview: DoublePageNodeData["preview"] = {
        label: `Pagine ${leftPageNumber}/${rightPageNumber}`,
        leftPageNumber,
        rightPageNumber,
        backgroundImage: new File([], ""),
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
        audio: new File([], ""),
      };
      const data: DoublePageNodeData = {
        label: `Pagine ${leftPageNumber}/${rightPageNumber}`,
        leftPageNumber,
        rightPageNumber,
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
        preview,
      };

      const newNode: Node<DoublePageNodeData> = {
        id: `${newNodeId}`,
        position: screenToFlowPosition({
          x: (event as MouseEvent).clientX,
          y: (event as MouseEvent).clientY,
        }),
        data,
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
  };
}
