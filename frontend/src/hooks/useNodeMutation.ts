import { savePageNode } from "@/api";
import { PageSchema } from "@/lib/zod";
import { type DefaultError, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function useNodeMutation(id: string, onSuccess: () => void) {
  const queryClient = useQueryClient();
  const saveNode = useMutation<unknown, DefaultError, PageSchema>({
    mutationKey: ["save-node", id],
    mutationFn: data => savePageNode(id, data),
    onSuccess() {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ["get-node"] });
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  return { saveNode };
}

export default useNodeMutation;
