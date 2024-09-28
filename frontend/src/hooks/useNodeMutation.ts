import { savePageNode } from "@/api";
import { PageSchema } from "@/lib/zod";
import { type DefaultError, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

function useNodeMutation(id: string, onSuccess: () => void) {
  const nodeMutation = useMutation<unknown, DefaultError, PageSchema>({
    mutationKey: ["save-node", id],
    mutationFn: data => savePageNode(id, data),
    onSuccess() {
      onSuccess();
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  return { nodeMutation };
}

export default useNodeMutation;
