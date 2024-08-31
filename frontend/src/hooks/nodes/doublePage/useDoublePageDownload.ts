import { useQuery } from "@tanstack/react-query";

export default function useDownloadMedia(id: string) {
  const backgroundImageQuery = useQuery({
    queryKey: ["get-background", id],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/uploads/page/backgrounds/${id}_background`
      );

      if (!response.ok) throw new Error(`Background with id ${id} not found`);

      const blob = await response.blob();

      return URL.createObjectURL(blob);
    },
    retry: false,
    enabled: false,
  });
  const audioQuery = useQuery({
    queryKey: ["get-audio", id],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/uploads/page/audios/${id}_audio`
      );

      if (!response.ok) throw new Error(`Audio with id ${id} not found`);

      const blob = await response.blob();

      return URL.createObjectURL(blob);
    },
    retry: false,
    enabled: false,
  });

  return { backgroundImageQuery, audioQuery };
}
