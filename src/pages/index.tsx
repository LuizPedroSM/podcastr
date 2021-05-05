import Head from "next/head";
export default function Home(props) {
  return (
    <>
      <Head>
        <title>Podcastr</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <p>{JSON.stringify(props.episodes)}</p>
    </>
  );
}

// SPA(Single Page Application ) useEffect
// SSR( Server Side Render) getServerSideProps
// SSG( Server Side Generate) getStaticProps

export async function getStaticProps() {
  const response = await fetch("http://localhost:3333/episodes");

  const data = await response.json();

  return {
    props: {
      episodes: data
    },
    revalidate: 60 * 60 * 8
  };
}
