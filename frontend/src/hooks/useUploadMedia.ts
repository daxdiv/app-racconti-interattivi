import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

export default function useUploadMedia(
  id: string,
  media: {
    backgroundImage: File;
    audio: File;
  }
) {
  const queryClient = useQueryClient();
  const uploadBackgroundImageMutation = useMutation({
    mutationKey: ["upload-background", id],
    async mutationFn() {
      const formData = new FormData();

      formData.append("id", id);
      formData.append("background", media.backgroundImage);

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

      const blob = await response.blob();

      return URL.createObjectURL(blob);
    },
    onSuccess(oldData) {
      URL.revokeObjectURL(oldData);
      queryClient.invalidateQueries({
        queryKey: ["get-background", id],
      });
    },
    onError(error) {
      toast.error(`Error uploading background: ${error.message.toLowerCase()}`);
    },
  });
  const uploadAudioMutation = useMutation({
    mutationKey: ["upload-audio", id],
    async mutationFn() {
      const formData = new FormData();

      formData.append("id", id);
      formData.append("audio", media.audio);

      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/upload/audio`, {
        method: "POST",
        body: formData,
      });

      if (response.status !== 201) {
        const error = await response.json();

        throw new Error(error.message);
      }

      const blob = await response.blob();

      return URL.createObjectURL(blob);
    },
    onSuccess(oldData) {
      URL.revokeObjectURL(oldData);
      queryClient.invalidateQueries({
        queryKey: ["get-audio", id],
      });
    },
    onError(error) {
      toast.error(`Error uploading audio: ${error.message.toLowerCase()}`);
    },
  });

  return {
    uploadBackgroundImageMutation,
    uploadAudioMutation,
  };
}
