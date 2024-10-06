import { restoreFlow, saveFlow } from "@/api";
import type { PageSchema } from "@/lib/zod";
import { useMutation, useQuery, type DefaultError } from "@tanstack/react-query";
import type { Edge, ReactFlowJsonObject } from "@xyflow/react";

type NodeFromQuery = PageSchema & { id: string; position: { x: string; y: string } };

type QueryData = {
  nodes: NodeFromQuery[];
  edges: Edge[];
};

function useFlow() {
  const save = useMutation<{ message: string }, { message: string }, ReactFlowJsonObject>(
    {
      mutationKey: ["save-flow"],
      mutationFn: flow => saveFlow(flow),
    }
  );

  const restore = useQuery<unknown, DefaultError, QueryData>({
    queryKey: ["restore-flow"],
    queryFn: restoreFlow,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return { save, restore };
}

export default useFlow;
