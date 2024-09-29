import { NodeQueryContext } from "@/contexts/nodeQueryContext";
import { useContext } from "react";

export const useNodeQueryContext = () => {
  const context = useContext(NodeQueryContext);

  if (!context) {
    throw new Error("NodeQueryContext must be within NodeQueryProvider");
  }

  return context;
};
