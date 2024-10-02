import { saveFlow } from "@/api";
import { type DefaultError, useMutation } from "@tanstack/react-query";
import type { ReactFlowJsonObject } from "@xyflow/react";
import toast from "react-hot-toast";

function useSaveFlow() {
  return useMutation<{ message: string }, DefaultError, ReactFlowJsonObject>({
    mutationKey: ["save-flow"],
    mutationFn: flow => saveFlow(flow),
    onSuccess({ message }) {
      toast.success(message);
    },
    onError(error) {
      toast.error(`Errore salvataggio racconto (${error.message})`);
    },
  });
}

export default useSaveFlow;
