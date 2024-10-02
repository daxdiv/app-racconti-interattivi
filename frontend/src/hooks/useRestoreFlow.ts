import { restoreFlow } from "@/api";
import type { PageSchema } from "@/lib/zod";
import { useQuery, type DefaultError } from "@tanstack/react-query";
import type { Edge } from "@xyflow/react";

type NodeFromQuery = PageSchema & { id: string; position: { x: string; y: string } };

type QueryData = {
  nodes: NodeFromQuery[];
  edges: Edge[];
};

function useRestoreFlow() {
  return useQuery<unknown, DefaultError, QueryData>({
    queryKey: ["restore-flow"],
    queryFn: restoreFlow,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export default useRestoreFlow;
