import type { ReactFlowJsonObject } from "@xyflow/react";
import { objectToFormData } from "@/lib/utils";

export async function restoreFlow() {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/flow`);

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.message);
  }

  return await response.json();
}

export async function saveFlow(flow: ReactFlowJsonObject) {
  const formData = objectToFormData({
    nodes: flow.nodes.map(n => ({ id: n.id, position: n.position, ...n.data })),
    edges: flow.edges.map(e => ({ id: e.id, source: e.source, target: e.target })),
  });

  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/flow`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.message);
  }

  return await response.json();
}
