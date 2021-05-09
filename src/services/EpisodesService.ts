import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { api } from "./api";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";

export const EpisodesService = {
  getEpisodes: async (_limit: number, _sort: string, _order: string) => {
    const { data } = await api.get("episodes", {
      params: { _limit, _sort, _order }
    });

    return data;
  },

  getEpisodesFormatted: async (
    _limit: number,
    _sort: string,
    _order: string
  ) => {
    const { data } = await api.get("episodes", {
      params: { _limit, _sort, _order }
    });

    const episodes = data.map(episode => {
      return {
        id: episode.id,
        title: episode.title,
        thumbnail: episode.thumbnail,
        members: episode.members,
        url: episode.file.url,
        duration: Number(episode.file.duration),
        durationAsString: convertDurationToTimeString(
          Number(episode.file.duration)
        ),
        publishedAt: format(parseISO(episode.published_at), "d MMM yy", {
          locale: ptBR
        })
      };
    });
    return episodes;
  },

  getEpisodeFormatted: async (slug: string) => {
    const { data } = await api.get(`episodes/${slug}`);
    const episode = {
      id: data.id,
      title: data.title,
      thumbnail: data.thumbnail,
      members: data.members,
      description: data.description,
      url: data.file.url,
      duration: Number(data.file.duration),
      durationAsString: convertDurationToTimeString(Number(data.file.duration)),
      publishedAt: format(parseISO(data.published_at), "d MMM yy", {
        locale: ptBR
      })
    };

    return episode;
  }
};
