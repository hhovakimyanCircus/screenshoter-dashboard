import React, { useEffect, useState } from 'react';

import { getAuth } from '@firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

import Loading from '@/components/Loading';
import { Recording, RecordingFirebaseResponse } from '@/types';

type RecordingsProps = {
  sessionId: string;
};

const Recordings: React.FC<RecordingsProps> = ({ sessionId }) => {
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isLoadingRecordings, setIsLoadingRecordings] = useState<boolean>(true);

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
            setIsLoadingRecordings(false);
            setRecordings((prev) => {
              return [...prev, ...newRecordings];
            });
          });
      });
    }
  }, [user, sessionId]);

  if (loading || (user && isLoadingRecordings)) {
    return (
      <Loading
        wrapperClassName="flex flex-col items-center h-[calc(100vh-72px)] justify-center"
        iconClassName="w-20 h-20 fill-blue-500"
      />
    );
  }

  if (!loading && !user) {
    return (
      <div className="pt-20 h-[calc(100vh-72px)] text-center">
        <span className="text-2xl text-gray-600">
          Please authenticate to continue . . .
        </span>
      </div>
    );
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
