import Head from 'next/head';

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
      <main className="h-screen bg-slate-50">
        <div className="flex flex-col gap-4 items-center px-10 pt-20">
          <h1 className="text-3xl font-bold text-center">
            Welcome to My Screenshot dashboard
          </h1>
        </div>
      </main>
    </>
  );
}
