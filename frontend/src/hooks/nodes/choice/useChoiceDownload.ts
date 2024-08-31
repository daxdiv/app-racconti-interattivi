import { useQuery } from "@tanstack/react-query";

export default function useChoiceDownload(id: string) {
  const backgroundQuery = useQuery({
    queryKey: ["get-choice-background", id],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/uploads/choice/backgrounds/${
          id.split("choice-")[1]
        }_background`
      );

      if (!response.ok) throw new Error(`Background with id ${id} not found`);

      const blob = await response.blob();

      return URL.createObjectURL(blob);
    },
    retry: false,
    enabled: false,
  });
  const audioQuery = useQuery({
    queryKey: ["get-choice-audios", id],
    queryFn: async () => {
      const responses = await Promise.all([
        fetch(
          `${import.meta.env.VITE_SERVER_URL}/uploads/choice/audios/${
            id.split("choice-")[1]
          }_choice_audio`
        ),
        fetch(
          `${import.meta.env.VITE_SERVER_URL}/uploads/choice/audios/${
            id.split("choice-")[1]
          }_option-1_audio`
        ),
        fetch(
          `${import.meta.env.VITE_SERVER_URL}/uploads/choice/audios/${
            id.split("choice-")[1]
          }_option-2_audio`
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
  const feedbackAudioQuery = useQuery({
    queryKey: ["get-choice-feedback-audios", id],
    queryFn: async () => {
      const responses = await Promise.all([
        fetch(
          `${import.meta.env.VITE_SERVER_URL}/uploads/choice/audios/${
            id.split("choice-")[1]
          }_feedback_option-1_audio`
        ),
        fetch(
          `${import.meta.env.VITE_SERVER_URL}/uploads/choice/audios/${
            id.split("choice-")[1]
          }_feedback_option-2_audio`
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

  return { backgroundQuery, audioQuery, feedbackAudioQuery };
}
