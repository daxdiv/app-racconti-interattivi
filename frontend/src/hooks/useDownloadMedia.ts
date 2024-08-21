import { useQuery } from "@tanstack/react-query";

export default function useDownloadMedia(id: string) {
  const backgroundImageQuery = useQuery({
    queryKey: ["get-background", id],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/uploads/backgrounds/${id}_background`
      );

      if (!response.ok) throw new Error(`Background with id ${id} not found`);

      const blob = await response.blob();

      return URL.createObjectURL(blob);
    },
    retry: false,
  });
  const audioQuery = useQuery({
    queryKey: ["get-audio", id],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/uploads/audios/${id}_audio`
      );

      if (!response.ok) throw new Error(`Audio with id ${id} not found`);

      const blob = await response.blob();

      return URL.createObjectURL(blob);
    },
    retry: false,
  });

  return { backgroundImageQuery, audioQuery };
}
