import Head from 'next/head';
import { useRouter } from 'next/router';

import Header from '@/components/Header';
import Recordings from '@/components/Recordings';

export default function RecordingSessionPage() {
  const router = useRouter();
  const { sessionId } = router.query;

  return (
    <>
      <Head>
        <title>My Screenshot extension recordings</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="px-64 pb-10 mt-16 h-full bg-slate-50">
        <Recordings sessionId={sessionId as string} />
      </main>
    </>
  );
}
