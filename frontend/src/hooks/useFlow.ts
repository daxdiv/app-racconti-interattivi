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
  const save = useMutation<Message, Message, ReactFlowJsonObject>({
    mutationKey: ["save-flow"],
    mutationFn: saveFlow,
  });
  const restore = useQuery<unknown, DefaultError, QueryData>({
    queryKey: ["restore-flow"],
    queryFn: restoreFlow,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    refetchOnWindowFocus: false,
  });
  const deleteFlow = useMutation<Message, Message, string>({
    mutationKey: ["delete-flow"],
    mutationFn: deleteFlowApi,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["me"],
      });
    },
  });

  return { create, save, restore, deleteFlow };
}

export default useFlow;
