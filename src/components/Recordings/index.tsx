import React, { useCallback, useEffect, useState } from 'react';

import { getAuth } from '@firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

import Loading from '@/components/base/Loading';
import ShareRecordingButton from '@/components/Recordings/ShareRecordingButton';
import RecordingsList from '@/components/RecordingsList';
import { fetchRecordings } from '@/firebase';
import { Recording, RecordingFirebaseResponse } from '@/types';

type RecordingsProps = {
  sessionId: string;
};

const Recordings: React.FC<RecordingsProps> = ({ sessionId }) => {
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isLoadingRecordings, setIsLoadingRecordings] = useState<boolean>(true);
  const [idToken, setIdToken] = useState<string>('');
  const [lastId, setLastId] = useState<string>('');
  const [lastTimestamp, setLastTimestamp] = useState<number>(0);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [allRecordingsLoaded, setAllRecordingsLoaded] =
    useState<boolean>(false);
  const recordingsLimit = 2;

  const onRecordingsLoaded = useCallback(
    (result: RecordingFirebaseResponse | null) => {
      if (result) {
        const newRecordings = Object.keys(result).map((recordingKey) => {
          return {
            id: recordingKey,
            ...result[recordingKey],
          };
        });
        setRecordings((prev) => {
          return [...prev, ...newRecordings];
        });
        setLastId(newRecordings[newRecordings.length - 1].id);
        setLastTimestamp(newRecordings[newRecordings.length - 1].timestamp);
      }

      setIsLoadingRecordings(false);
    },
    []
  );

  const loadNewRecordings = useCallback(() => {
    setIsLoadingRecordings(true);
    fetchRecordings(
      user?.uid as string,
      idToken,
      sessionId,
      recordingsLimit,
      (result: RecordingFirebaseResponse | null) => {
        onRecordingsLoaded(result);
        if (!result) {
          setAllRecordingsLoaded(true);
        }
      },
      lastTimestamp
    );
  }, [idToken, lastTimestamp, user?.uid, onRecordingsLoaded]);

  useEffect(() => {
    if (sessionId && user) {
      user.getIdToken().then((newIdToken) => {
        fetchRecordings(
          user.uid,
          newIdToken,
          sessionId,
          recordingsLimit,
          onRecordingsLoaded
        );
        setIdToken(newIdToken);
      });
    }
  }, [user, sessionId, onRecordingsLoaded]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (
      lastId &&
      scrollPosition > 0 &&
      !isLoadingRecordings &&
      !allRecordingsLoaded
    ) {
      const lastIdElement = document.getElementById(`recording-step-${lastId}`);
      if (
        lastIdElement &&
        lastIdElement.getBoundingClientRect().bottom <= window.innerHeight
      ) {
        loadNewRecordings();
      }
    }
  }, [
    lastId,
    scrollPosition,
    isLoadingRecordings,
    loadNewRecordings,
    allRecordingsLoaded,
  ]);

  if (loading || (user && isLoadingRecordings && recordings.length === 0)) {
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

  if (!isLoadingRecordings && recordings.length === 0) {
    return (
      <div className="pt-20 h-[calc(100vh-72px)] text-center">
        <span className="text-2xl text-gray-600">
          Nothing found for this specific session. Please try visiting this page
          later . . .
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col mb-10">
      <div className="flex justify-end mt-16">
        <ShareRecordingButton
          sessionId={sessionId}
          userId={user?.uid as string}
          idToken={idToken}
        />
      </div>
      <RecordingsList recordings={recordings} />
      {recordings.length > 0 && isLoadingRecordings && (
        <Loading wrapperClassName="flex flex-col items-center justify-center mt-2" />
      )}
    </div>
  );
};

export default Recordings;
