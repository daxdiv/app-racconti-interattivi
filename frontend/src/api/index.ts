import { PageSchema } from "@/lib/zod";
import { objectToFormData } from "@/lib/utils";

export async function saveNode(id: string, params: PageSchema) {
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
