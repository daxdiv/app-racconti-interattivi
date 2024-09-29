import { createContext } from "react";
import { DefaultError, useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getPageNode } from "@/api";
import type { PageSchema } from "@/lib/zod";

type NodeQueryProviderProps = {
  id: string;
  children: string | JSX.Element | JSX.Element[];
};
export type MyQueryResult = PageSchema & { background: string };

// prettier-ignore
export const NodeQueryContext = createContext<UseQueryResult<MyQueryResult> | null>(null);
export function NodeQueryProvider({ id, children }: NodeQueryProviderProps) {
  const nodeQuery = useQuery<unknown, DefaultError, MyQueryResult>({
    queryKey: ["get-node"],
    queryFn: () => getPageNode(id),
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return (
    <NodeQueryContext.Provider value={nodeQuery}>{children}</NodeQueryContext.Provider>
  );
}
