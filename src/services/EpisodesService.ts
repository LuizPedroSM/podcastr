import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { api } from "./api";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";
import { connectToDatabase } from "../utils/mongodb";

export const EpisodesService = {
  getEpisodesFromDB: async (_limit, _sort, _order) => {
    const order = _order == "desc" ? -1 : 1;

    const sort = _sort ? { [_sort as string]: order } : { published_at: order };

    const { db } = await connectToDatabase();

    const data = await db
      .collection("episodes")
      .find()
      .limit(+_limit)
      .sort(sort)
      .toArray();

    return data;
  },

  getEpisodeFromDB: async slug => {
    const { db } = await connectToDatabase();
    const data = await db.collection("episodes").findOne({ id: slug });
    return data;
  },

  getEpisodesFromAPI: async (_limit: number, _sort: string, _order: string) => {
    const { data } = await api.get("episodes", {
      params: { _limit, _sort, _order }
    });

    return data;
  },

  getEpisodeFromAPI: async slug => {
    const { data } = await api.get(`episodes/${slug}`);
    return data;
  },

  formatEpisodes: episodes => {
    const formattedEpisodes = episodes.map(episode => {
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
    return formattedEpisodes;
  },

  formatEpisode: episode => {
    const formattedEpisode = {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      description: episode.description,
      url: episode.file.url,
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(
        Number(episode.file.duration)
      ),
      publishedAt: format(parseISO(episode.published_at), "d MMM yy", {
        locale: ptBR
      })
    };

    return formattedEpisode;
  }
};
