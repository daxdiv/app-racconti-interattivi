import { restoreFlow, saveFlow, deleteFlow as deleteFlowApi, createFlow } from "@/api";
import type { PageSchema } from "@/lib/zod";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type DefaultError,
} from "@tanstack/react-query";
import type { Edge, ReactFlowJsonObject } from "@xyflow/react";

type NodeFromQuery = PageSchema & { id: string; position: { x: string; y: string } };
type Message = {
  message: string;
};
type QueryData = {
  nodes: NodeFromQuery[];
  edges: Edge[];
};
type CreateFlowVariables = { label: string } & Omit<ReactFlowJsonObject, "viewport">;
type SaveFlowPayload = { flowId: string } & ReactFlowJsonObject;

function useFlow() {
  const queryClient = useQueryClient();
  const create = useMutation<Message, Message, CreateFlowVariables>({
    mutationKey: ["create-flow"],
    mutationFn: createFlow,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["me"],
      });
    },
  });
  const save = useMutation<Message, Message, SaveFlowPayload>({
    mutationKey: ["save-flow"],
    mutationFn: saveFlow,
  });
  const useRestore = (flowId: string) => {
    return useQuery<unknown, DefaultError, QueryData & { label: string }>({
      queryKey: ["restore-flow", flowId],
      queryFn: () => restoreFlow(flowId),
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retry: false,
    });
  };
  const deleteFlow = useMutation<Message, Message, string>({
    mutationKey: ["delete-flow"],
    mutationFn: deleteFlowApi,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["me"],
      });
    },
  });

  return { create, save, useRestore, deleteFlow };
}

export default useFlow;
