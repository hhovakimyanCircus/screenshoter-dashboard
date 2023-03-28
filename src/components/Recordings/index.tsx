import React, { useEffect, useState } from 'react';

import { getAuth } from '@firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

import { Recording, RecordingFirebaseResponse } from '@/types';

type RecordingsProps = {
  sessionId: string;
};

const Recordings: React.FC<RecordingsProps> = ({ sessionId }) => {
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  const [recordings, setRecordings] = useState<Recording[]>([]);

  console.log(recordings);

  useEffect(() => {
    // Get fresh id token
    if (user && sessionId) {
      user.getIdToken().then((idToken) => {
        fetch(
          `${process.env.NEXT_PUBLIC_DATABASE_URL}/users/${user.uid}/.json?auth=${idToken}&orderBy="sessionId"&equalTo="${sessionId}"`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
          .then((response) => response.json())
          .then((result: RecordingFirebaseResponse) => {
            const newRecordings = Object.keys(result).map((recordingKey) => {
              return {
                id: recordingKey,
                ...result[recordingKey],
              };
            });
            setRecordings((prev) => {
              return {
                ...prev,
                ...newRecordings,
              };
            });
          });
      });
    }
  }, [user, sessionId]);

  if (loading) {
    return <></>;
  }

  return <></>;
};

export default Recordings;
