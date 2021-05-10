import { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { EpisodesService } from "../services/EpisodesService";
import { usePlayer } from "../contexts/PlayerContext";

import styles from "../styles/Home.module.scss";
import episodes from "./api/episodes";

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  url: string;
  duration: number;
  durationAsString: string;
  publishedAt: string;
};

type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
};

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { playList } = usePlayer();

  const episodeList = [...latestEpisodes, ...allEpisodes];

  return (
    <>
      <Head>
        <title>Home | Podcastr</title>
      </Head>
      <div className={styles.homePage}>
        <section className={styles.latestEpisodes}>
          <h2>Últimos lançamentos</h2>
          <ul>
            {latestEpisodes.map((episode: Episode, index: number) => {
              return (
                <li key={episode.id}>
                  <Image
                    width={192}
                    height={192}
                    objectFit="contain"
                    src={episode.thumbnail}
                    alt={episode.title}
                  />

                  <div className={styles.episodeDetails}>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                    <p>{episode.members}</p>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationAsString}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => playList(episodeList, index)}
                  >
                    <img src="/play-green.svg" alt="Tocar episódio" />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
        <section className={styles.allEpisodes}>
          <h2>Todos os episódios</h2>

          <table cellSpacing={0}>
            <thead>
              <tr>
                <th></th>
                <th>Podcast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {allEpisodes.map((episode: Episode, index: number) => {
                return (
                  <tr key={episode.id}>
                    <td style={{ width: 80 }}>
                      <Image
                        width={120}
                        height={120}
                        objectFit="contain"
                        src={episode.thumbnail}
                        alt={episode.title}
                      />
                    </td>
                    <td>
                      <Link href={`/episodes/${episode.id}`}>
                        <a>{episode.title}</a>
                      </Link>
                    </td>
                    <td>{episode.members}</td>
                    <td style={{ width: 100 }}>{episode.publishedAt}</td>
                    <td>{episode.durationAsString}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() =>
                          playList(episodeList, index + latestEpisodes.length)
                        }
                      >
                        <img src="/play-green.svg" alt="Tocar episódio" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}

// SPA(Single Page Application ) useEffect
// SSR( Server Side Render) getServerSideProps
// SSG( Server Side Generate) getStaticProps

export const getStaticProps: GetStaticProps = async () => {
  const episodes: Episode[] = await EpisodesService.getEpisodesFromDB(
    12,
    "published_at",
    "desc"
  );

  const formattedEpisodes = EpisodesService.formatEpisodes(episodes);

  const latestEpisodes: Episode[] = formattedEpisodes.slice(0, 2);
  const allEpisodes: Episode[] = formattedEpisodes.slice(
    2,
    formattedEpisodes.length
  );

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 28800 // 8 hours
  };
};
