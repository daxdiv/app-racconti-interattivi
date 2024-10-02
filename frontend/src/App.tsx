import "@xyflow/react/dist/style.css";
import "@/styles/globals.css";

import {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  Panel,
  ReactFlow,
  ReactFlowInstance,
  type Node,
} from "@xyflow/react";
import { Network, Save } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { DEFAULT_DATA } from "./constants";
import DeleteButtonEdge from "@/components/edges/DeleteButtonEdge";
import Header from "@/components/ui/header";
import PageNode from "@/components/nodes/DoublePageNode";
import useReactFlowConnection from "@/hooks/useReactFlowConnection";
import useRestoreFlow from "@/hooks/useRestoreFlow";
import useSaveFlow from "@/hooks/useSaveFlow";
import { PageSchema } from "@/lib/zod";

function App() {
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const nodeTypes = useMemo(() => ({ doublePage: PageNode }), []);
  const edgeTypes = useMemo(() => ({ deleteButton: DeleteButtonEdge }), []);
  const reactFlowWrapper = useRef(null);
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onConnectStart,
    onConnectEnd,
    onLayout,
    isValidConnection,
  } = useReactFlowConnection();
  const saveFlow = useSaveFlow();
  const { data } = useRestoreFlow();

  const onSave = useCallback(async () => {
    if (rfInstance) {
      const flow = rfInstance.toObject();

      toast.promise(saveFlow.mutateAsync(flow), {
        loading: "Salvataggio in corso...",
        success: ({ message }) => message,
        error: ({ message }) => `Errore salvataggio racconto (${message})`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rfInstance]);

  useEffect(() => {
    if (!data) return;

    if (data.nodes.length !== 0) {
      setNodes(
        data.nodes.map(n => {
          const { id, position, ...rest } = n;
          const node: Node<PageSchema> = {
            id,
            position: {
              x: parseInt(position.x),
              y: parseInt(position.y),
            },
            data: rest,
            type: "doublePage",
          };
          return node;
        })
      );
    }
    if (data.edges.length !== 0) {
      setEdges(
        data.edges.map(e => ({
          ...e,
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
        }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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
          onInit={setRfInstance}
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
          <Panel
            position="bottom-center"
            className="flex justify-center gap-x-1"
          >
            <Button
              className="flex justify-center items-center"
              onClick={() => onLayout("horizontal")}
            >
              <Network className="mr-2 nodrag nopan -rotate-90" />
              Ordina
            </Button>
            <Button
              disabled={saveFlow.isPending}
              className="flex justify-center items-center"
              onClick={() => {
                const existNodesUnchanged = nodes.some(
                  n => JSON.stringify(n.data) === JSON.stringify(DEFAULT_DATA)
                );

                if (existNodesUnchanged) {
                  toast.error(
                    "Ci sono dei nodi non salvati, eliminali oppure compila tutti i campi richiesti"
                  );
                  return;
                }

                onSave();
              }}
            >
              <Save className="mr-2 nodrag nopan" />
              Salva racconto
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
