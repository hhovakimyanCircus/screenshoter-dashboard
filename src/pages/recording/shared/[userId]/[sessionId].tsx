import Head from 'next/head';
import { useRouter } from 'next/router';

import Header from '@/components/Header';
import SharedRecordings from '@/components/SharedRecordings';

export default function SharedRecordingSessionPage() {
  const router = useRouter();
  const { sessionId, userId } = router.query;

  return (
    <>
      <Head>
        <title>My Screenshot extension recordings</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="px-64 pb-10 mt-16 h-full bg-slate-50">
        <SharedRecordings
          recordingId={sessionId as string}
          sharerUserId={userId as string}
        />
      </main>
    </>
  );
}
