import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import useNodeUtils from "@/hooks/useNodeUtils";

export default function useUploadMedia(
  id: string,
  media: {
    backgroundImage: File | undefined;
    audios: ({ file: File; name: string } | undefined)[];
  }
) {
  const { resetPreview } = useNodeUtils();
  const queryClient = useQueryClient();

  const uploadBackgroundImageMutation = useMutation({
    mutationKey: ["upload-background", id],
    async mutationFn() {
      const formData = new FormData();

      formData.append("id", id);

      if (media.backgroundImage) formData.append("background", media.backgroundImage);

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/upload/background`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.status !== 201) {
        const error = await response.json();

        throw new Error(error.message);
      }

      return response.json();
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["get-background", id],
      });

      resetPreview(id);
    },
    onError(error) {
      toast.error(`Error uploading background: ${error.message.toLowerCase()}`);

      resetPreview(id);
    },
  });
  const uploadAudioMutation = useMutation({
    mutationKey: ["upload-audio", id],
    async mutationFn() {
      const formData = new FormData();

      formData.append("id", id);

      if (media.audios.length === 0) {
        console.log("qui");
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/upload/audio/${id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          const error = await response.json();

          throw new Error(error.message);
        }

        return response.json();
      }

      media.audios.forEach(a => {
        if (!a) return;

        formData.append(
          "audio[]",
          new File([a.file], a.name, {
            type: a.file.type,
            lastModified: a.file.lastModified,
          })
        );
      });

      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/upload/audio`, {
        method: "POST",
        body: formData,
      });

      if (response.status !== 201) {
        const error = await response.json();

        throw new Error(error.message);
      }

      return response.json();
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["get-audio", id],
      });

      resetPreview(id);
    },
    onError(error) {
      toast.error(`Error uploading audio: ${error.message.toLowerCase()}`);

      resetPreview(id);
    },
  });

  return {
    uploadBackgroundImageMutation,
    uploadAudioMutation,
  };
}
