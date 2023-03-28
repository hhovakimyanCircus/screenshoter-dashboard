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
              return [...prev, ...newRecordings];
            });
          });
      });
    }
  }, [user, sessionId]);

  if (loading) {
    return <></>;
  }

  return (
    <div className="flex flex-col mb-10">
      {recordings.map((recording, index) => {
        let recordingLink = <></>;
        if (
          index === 0 ||
          recordings[index].url !== recordings[index - 1].url
        ) {
          recordingLink = (
            <div
              className="py-5 px-20 mt-10 w-full bg-white rounded-lg border"
              key={`recording-${recording.id}`}
            >
              <div className="text-lg text-neutral-700">
                Navigate to{' '}
                <a
                  href={recording.url}
                  target="_blank"
                  className="text-blue-500"
                >
                  {recording.url}
                </a>
              </div>
            </div>
          );
        }

        const recordingStep = (
          <div className="py-10 px-20 mt-10 w-full bg-white rounded-lg border">
            <div className="mb-4 text-lg text-neutral-700">
              {recording.clickedElementName}
            </div>
            <img src={recording.image} alt="" className="w-full" />
          </div>
        );

        return (
          <React.Fragment key={`recording-${recording.id}`}>
            {recordingLink}
            {recordingStep}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Recordings;
