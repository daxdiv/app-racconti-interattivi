import { getSavedNodes } from "@/api";
import { type DefaultError, useQuery } from "@tanstack/react-query";

function useSavedNodes() {
  return useQuery<unknown, DefaultError, { id: string; x: string; y: string }[]>({
    queryKey: ["get-saved-nodes"],
    queryFn: getSavedNodes,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export default useSavedNodes;
