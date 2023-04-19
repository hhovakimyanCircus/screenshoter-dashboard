import { useEffect, useState } from 'react';

import { getAuth } from '@firebase/auth';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';

import Header from '@/components/Header';
import RecordingSteps from '@/components/Recordings';

export default function RecordingSessionPage() {
  const router = useRouter();
  const { sessionId } = router.query;

  const [idToken, setIdToken] = useState<string>('');

  const auth = getAuth();
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      user.getIdToken().then((newIdToken) => {
        setIdToken(newIdToken);
      });
    }
  }, [user]);

  return (
    <>
      <Head>
        <title>My Screenshot extension recordings</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header
        sessionId={sessionId as string}
        userId={user?.uid}
        idToken={idToken}
      />
      <main className="px-64 pb-10 mt-16 h-full bg-slate-50">
        <RecordingSteps recordingId={sessionId as string} />
      </main>
    </>
  );
}
