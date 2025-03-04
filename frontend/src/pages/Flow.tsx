import Header from "@/components/ui/header";
import useReactFlowConnection from "@/hooks/useFlowUtils";
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
import { Activity, Network, Save } from "lucide-react";
import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import DeleteButtonEdge from "@/components/edges/DeleteButtonEdge";
import PageNode from "@/components/nodes/DoublePageNode";
import { Button } from "@/components/ui/button";
import { Navigate, useParams } from "react-router-dom";
import CreateNode from "@/components/CreateNode";

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
    isValidState,
  } = useReactFlowConnection();
  const { flowId } = useParams();
  const { save, useRestore } = useFlow();
  const restore = useRestore(flowId as string);
  const { theme } = useTheme();

  const onSave = useCallback(async () => {
    if (rfInstance) {
      const flow = rfInstance.toObject();

      toast.promise(save.mutateAsync({ flowId: flowId!, ...flow }), {
        loading: "Salvataggio in corso...",
        success: ({ message }) => message,
        error: ({ message }) => `Errore salvataggio racconto (${message})`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rfInstance]);

  useEffect(() => {
    if (!restore.data) return;

    if (restore.data.nodes.length !== 0) {
      setNodes(
        restore.data.nodes.map(n => {
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
    if (restore.data.edges.length !== 0) {
      setEdges(
        restore.data.edges.map(e => ({
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
  }, [restore.data]);

  if (!restore.isLoading && restore.isError) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return (
    <>
      <Header label={restore.data?.label || "Titolo"} />
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
              disabled={save.isPending || restore.isLoading || restore.isError}
              className="flex justify-center items-center"
              onClick={() => {
                onSave();
              }}
            >
              <Save className="mr-2 nodrag nopan" />
              Salva racconto
            </Button>

            <Button
              className="flex justify-center items-center"
              onClick={() => {
                if (!isValidState()) {
                  toast.error(
                    `Stato del racconto non corretto, verifica che: \n
                    - non vi siano nodi scollegati \n
                    - hai compilato tutti i campi richiesti in ogni nodo \n
                    - tutti i nodi scelta abbiano due collegamenti in uscita
                    `,
                    {
                      duration: 5000,
                      style: {
                        fontSize: "0.75rem",
                        lineHeight: "1rem",
                      },
                    }
                  );
                } else {
                  toast.success("Stato del racconto corretto");
                }
              }}
            >
              <Activity className="mr-2 nodrag nopan" />
              Verifica stato
            </Button>

            <CreateNode />
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
