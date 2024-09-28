import { PageSchema } from "@/lib/zod";
import { objectToFormData } from "@/lib/utils";

export async function savePageNode(id: string, params: PageSchema) {
  const formData = objectToFormData({ nodeId: id, ...params });

  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/node?nodeType=${params.type}`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (response.status !== 201) {
    const error = await response.json();

    throw new Error(error.message);
  }

  return await response.json();
}

export async function getPageNode(id: string) {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/node/${id}`);

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.message);
  }

  return await response.json();
}
