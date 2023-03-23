import Head from 'next/head';

import GoogleAuth from '@/components/GoogleAuth';

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
      <main>
        <div className="flex flex-col gap-4 items-center p-4">
          <h1 className="text-3xl font-bold text-center">
            Welcome to My Screenshot dashboard
          </h1>
          <GoogleAuth />
        </div>
      </main>
    </>
  );
}
