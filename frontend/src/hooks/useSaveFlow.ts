import type { ReactFlowJsonObject } from "@xyflow/react";
import { saveFlow } from "@/api";
import { useMutation } from "@tanstack/react-query";

function useSaveFlow() {
  return useMutation<{ message: string }, { message: string }, ReactFlowJsonObject>({
    mutationKey: ["save-flow"],
    mutationFn: flow => saveFlow(flow),
  });
}

export default useSaveFlow;
