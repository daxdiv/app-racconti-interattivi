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
      const responses = await Promise.all([
        fetch(`${import.meta.env.VITE_SERVER_URL}/uploads/page/audios/${id}_audio`),
        fetch(`${import.meta.env.VITE_SERVER_URL}/uploads/page/audios/${id}_question`),
        fetch(`${import.meta.env.VITE_SERVER_URL}/uploads/page/audios/${id}_choice`),
        fetch(
          `${import.meta.env.VITE_SERVER_URL}/uploads/page/audios/${id}_question_opt1`
        ),
        fetch(
          `${import.meta.env.VITE_SERVER_URL}/uploads/page/audios/${id}_question_opt2`
        ),
        fetch(`${import.meta.env.VITE_SERVER_URL}/uploads/page/audios/${id}_choice_opt1`),
        fetch(`${import.meta.env.VITE_SERVER_URL}/uploads/page/audios/${id}_choice_opt2`),
        fetch(
          `${
            import.meta.env.VITE_SERVER_URL
          }/uploads/page/audios/${id}_question_feedback_opt1`
        ),
        fetch(
          `${
            import.meta.env.VITE_SERVER_URL
          }/uploads/page/audios/${id}_question_feedback_opt2`
        ),
        fetch(
          `${
            import.meta.env.VITE_SERVER_URL
          }/uploads/page/audios/${id}_choice_feedback_opt1`
        ),
        fetch(
          `${
            import.meta.env.VITE_SERVER_URL
          }/uploads/page/audios/${id}_choice_feedback_opt2`
        ),
      ]);
      const urls = await Promise.all(
        responses.map(async r => {
          if (r.ok) return URL.createObjectURL(await r.blob());
        })
      );

      return urls;
    },
    retry: false,
    enabled: false,
  });

  return { backgroundImageQuery, audioQuery };
}
