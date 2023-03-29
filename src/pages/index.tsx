import Head from 'next/head';

import Dashboard from '@/components/Dashboard';
import Header from '@/components/Header';

export default function Home() {
  return (
    <>
      <Head>
        <title>My Screenshot extension dashboard</title>
        <meta
          name="description"
          content="Dashboard of My Screenshot extension"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Dashboard />
    </>
  );
}
