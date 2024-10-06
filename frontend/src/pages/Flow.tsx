import Header from "@/components/ui/header";
import { DEFAULT_DATA } from "@/constants";
import useReactFlowConnection from "@/hooks/useReactFlowConnection";
import useFlow from "@/hooks/useFlow";
import useTheme from "@/hooks/useTheme";
import { PageSchema } from "@/lib/zod";
import {
  ReactFlowInstance,
  MarkerType,
  ReactFlow,
  Background,
  Panel,
  Controls,
  MiniMap,
  type Node,
} from "@xyflow/react";
import { Network, Save } from "lucide-react";
import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import DeleteButtonEdge from "@/components/edges/DeleteButtonEdge";
import { ModeToggle } from "@/components/ModeToggle";
import PageNode from "@/components/nodes/DoublePageNode";
import { Button } from "@/components/ui/button";

function Flow() {
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
  const {
    save,
    restore: { data },
  } = useFlow();
  const { theme } = useTheme();

  const onSave = useCallback(async () => {
    if (rfInstance) {
      const flow = rfInstance.toObject();

      toast.promise(save.mutateAsync(flow), {
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
          type: "deleteButton",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 30,
            height: 30,
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
          colorMode={theme}
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
              disabled={save.isPending}
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
            <ModeToggle />
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
      </div>
    </>
  );
}

export default Flow;
