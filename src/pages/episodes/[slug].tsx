import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

import { api } from "../../services/api";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";
import { usePlayer } from "../../contexts/PlayerContext";

import styles from "./episode.module.scss";

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  description: string;
  url: string;
  duration: number;
  durationAsString: string;
  publishedAt: string;
};

type EpisodeProps = {
  episode: Episode;
};

export default function Episode({ episode }: EpisodeProps) {
  // const router = useRouter();
  // para quando usar fallback como true e fazer a chamada a api pelo client
  // if (router.isFallback) {
  //   return <p>Carregando</p>;
  // }
  const { play } = usePlayer();

  return (
    <div className={styles.episode}>
      <Head>
        <title>{episode.title} | Podcastr</title>
      </Head>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image
          width={700}
          height={160}
          objectFit="cover"
          src={episode.thumbnail}
        />
        <button type="button" onClick={() => play(episode)}>
          <img src="/play.svg" alt="Tocar episódio" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  );
}

//Paginas estáticas geradas dinãmicamente precisa do getStaticPaths
export const getStaticPaths: GetStaticPaths = async () => {
  const { data }: { data: Episode[] } = await api.get("episodes", {
    params: {
      _limit: 2,
      _sort: "published_at",
      _order: "desc"
    }
  });

  const paths = data.map((episode: Episode) => {
    return {
      params: {
        slug: episode.id
      }
    };
  });

  return {
    paths,
    fallback: "blocking" // incremental static regeneration (ISR)
    // fallback: true // vai fazer o fetch no cliente
    // fallback: false // vai dar erro 404 se não passar parâmetro no paths
  };
};

export const getStaticProps: GetStaticProps = async ctx => {
  const { slug } = ctx.params;

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
  return {
    props: { episode },
    revalidate: 60 * 60 * 24 // 24 hours
  };
};
