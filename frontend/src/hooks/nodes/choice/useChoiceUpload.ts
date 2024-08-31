import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useReactFlow, type Node } from "@xyflow/react";

import toast from "react-hot-toast";

export default function useChoiceUpload(id: string) {
  const queryClient = useQueryClient();
  const { updateNodeData } = useReactFlow<Node<ChoiceNodeData>>();

  const uploadImage = useMutation({
    mutationKey: ["upload-choice-background", id],
    async mutationFn(file: File) {
      const formData = new FormData();

      formData.append("id", id.split("choice-")[1]);
      formData.append("background", file);

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/upload/background?nodeType=choice`,
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
        queryKey: ["get-choice-background", id],
      });
      updateNodeData(id, ({ data }) => ({
        ...data.preview,
        preview: {
          ...data.preview,
          image: new File([], ""),
        },
      }));
    },
    onError(error) {
      toast.error(`Error uploading image: ${error.message.toLowerCase()}`);
      updateNodeData(id, ({ data }) => ({
        ...data.preview,
        preview: {
          ...data.preview,
          image: new File([], ""),
        },
      }));
    },
  });

  const uploadAudio = useMutation({
    mutationKey: ["upload-choice-audio", id],
    async mutationFn(payload: {
      file: File;
      of: "choice" | "option-1" | "option-2";
      feedback: boolean;
    }) {
      const url = payload.feedback
        ? `${import.meta.env.VITE_SERVER_URL}/upload/audio?nodeType=choice&of=${
            payload.of
          }&feedback=true`
        : `${import.meta.env.VITE_SERVER_URL}/upload/audio?nodeType=choice&of=${
            payload.of
          }`;
      const formData = new FormData();

      formData.append("id", id.split("choice-")[1]);
      formData.append("audio", payload.file);

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (response.status !== 201) {
        const error = await response.json();

        throw new Error(error.message);
      }

      return response.json();
    },
    onSuccess(_, { feedback }) {
      if (feedback) {
        queryClient.invalidateQueries({
          queryKey: ["get-choice-audios", id],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["get-choice-audios", id],
        });
      }

      updateNodeData(id, ({ data }) => ({
        ...data.preview,
        preview: {
          ...data.preview,
          audio: [new File([], ""), new File([], ""), new File([], "")],
        },
      }));
    },
    onError(error) {
      toast.error(`Error uploading audio: ${error.message.toLowerCase()}`);
      updateNodeData(id, ({ data }) => ({
        ...data.preview,
        preview: {
          ...data.preview,
          audio: [new File([], ""), new File([], ""), new File([], "")],
        },
      }));
    },
  });

  return { uploadImage, uploadAudio };
}
