import type { AuthSchema, PasswordSchema, UsernameSchema } from "@/lib/zod";

import type { ReactFlowJsonObject } from "@xyflow/react";
import { objectToFormData } from "@/lib/utils";
import toast from "react-hot-toast";

type SetPasswordPayload = Pick<PasswordSchema, "password" | "newPassword"> & {
  userId: string;
};
type CreateFlowPayload = { label: string } & Omit<ReactFlowJsonObject, "viewport">;
type SaveFlowPayload = { flowId: string } & ReactFlowJsonObject;

export async function createFlow(flow: CreateFlowPayload) {
  const formData = objectToFormData({
    label: flow.label,
    nodes: flow.nodes.map(n => ({ id: n.id, position: n.position, ...n.data })),
    edges: flow.edges.map(e => ({ id: e.id, source: e.source, target: e.target })),
  });

  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/flow`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.message);
  }

  return await response.json();
}

export async function restoreFlow(flowId: string) {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/flow/${flowId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.message);
  }

  return await response.json();
}

export async function saveFlow(flow: SaveFlowPayload) {
  const formData = objectToFormData({
    nodes: flow.nodes.map(n => ({ id: n.id, position: n.position, ...n.data })),
    edges: flow.edges.map(e => ({ id: e.id, source: e.source, target: e.target })),
  });

  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/flow/${flow.flowId}`, {
    method: "PUT",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.message);
  }

  return await response.json();
}

export async function downloadFlow(flowId: string) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/flow/${flowId}/download`,
      { credentials: "include" }
    );

    if (!response.ok) {
      toast.error("Errore durante il download del file");
      return;
    }

    const data = await response.json();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "flow.json";
    a.click();

    a.remove();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Errore nel download del file:", error);
  }
}

export async function deleteFlow(flowId: string) {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/flow/${flowId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.message);
  }

  return await response.json();
}

export async function me() {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/user`, {
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.message);
  }

  return await response.json();
}

export async function signUp(user: AuthSchema) {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/sign-up`, {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.message);
  }

  return await response.json();
}

export async function signIn(user: AuthSchema) {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/sign-in`, {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.message);
  }

  return await response.json();
}

export async function signOut() {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/sign-out`, {
    method: "POST",
    credentials: "include",
  });

  return await response.json();
}

export async function setUsername(payload: UsernameSchema & { userId: string }) {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/user/${payload.userId}/username`,
    {
      method: "PUT",
      body: JSON.stringify({ username: payload.username }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.message);
  }

  return await response.json();
}

export async function setPassword(payload: SetPasswordPayload) {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/user/${payload.userId}/password`,
    {
      method: "PUT",
      body: JSON.stringify({
        password: payload.password,
        newPassword: payload.newPassword,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.message);
  }

  return await response.json();
}

export async function deleteAccount(userId: string) {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/${userId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.message);
  }

  return await response.json();
}
