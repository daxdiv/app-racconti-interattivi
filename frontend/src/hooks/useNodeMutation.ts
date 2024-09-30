import { deletePageNode, savePageNode } from "@/api";
import { PageSchema } from "@/lib/zod";
import { type DefaultError, useMutation, useQueryClient } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import toast from "react-hot-toast";
import useNodeUtils from "./useNodeUtils";

function useNodeMutation(id: string, onSuccess?: () => void) {
  const { onNodeDelete } = useNodeUtils();
  const { getNode } = useReactFlow();
  const { x, y } = getNode(id)!.position;
  const queryClient = useQueryClient();

  const saveNode = useMutation<unknown, DefaultError, PageSchema>({
    mutationKey: ["save-node", id],
    mutationFn: data => savePageNode(id, { ...data, position: { x, y } }),
    onSuccess() {
      onSuccess?.();
      queryClient.invalidateQueries({ queryKey: ["get-node"] });
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const deleteNode = useMutation({
    mutationKey: ["delete-node", id],
    mutationFn: () => deletePageNode(id),
    onSuccess() {
      onNodeDelete(id);
    },
  });

  return { saveNode, deleteNode };
}

export default useNodeMutation;
