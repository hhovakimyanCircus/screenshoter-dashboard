import React, { useCallback, useEffect, useState } from 'react';

import { getAuth } from '@firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

import Loading from '@/components/base/Loading';
import ShareRecordingButton from '@/components/Recordings/ShareRecordingButton';
import RecordingStepsList from '@/components/RecordingsList';
import { fetchRecordingSteps } from '@/firebase';
import { RecordingStep, RecordingStepsFirebaseResponse } from '@/types';

type RecordingStepsProps = {
  recordingId: string;
};

const RecordingSteps: React.FC<RecordingStepsProps> = ({ recordingId }) => {
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  const [recordingSteps, setRecordingSteps] = useState<RecordingStep[]>([]);
  const [isLoadingRecordingSteps, setIsLoadingRecordingSteps] =
    useState<boolean>(true);
  const [idToken, setIdToken] = useState<string>('');
  const [lastId, setLastId] = useState<string>('');
  const [lastTimestamp, setLastTimestamp] = useState<number>(0);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [allRecordingStepsLoaded, setAllRecordingStepsLoaded] =
    useState<boolean>(false);
  const recordingsLimit = 2;

  const onRecordingStepsLoaded = useCallback(
    (result: RecordingStepsFirebaseResponse | null) => {
      if (result) {
        const newRecordingSteps = Object.keys(result).map(
          (recordingStepKey) => {
            return {
              id: recordingStepKey,
              ...result[recordingStepKey],
            };
          }
        );
        setRecordingSteps((prev) => {
          return [...prev, ...newRecordingSteps];
        });
        setLastId(newRecordingSteps[newRecordingSteps.length - 1].id);
        setLastTimestamp(
          newRecordingSteps[newRecordingSteps.length - 1].timestamp
        );
      }

      setIsLoadingRecordingSteps(false);
    },
    []
  );

  const loadNewRecordingSteps = useCallback(() => {
    setIsLoadingRecordingSteps(true);
    fetchRecordingSteps(
      user?.uid as string,
      idToken,
      recordingId,
      recordingsLimit,
      (result: RecordingStepsFirebaseResponse | null) => {
        onRecordingStepsLoaded(result);
        if (!result) {
          setAllRecordingStepsLoaded(true);
        }
      },
      lastTimestamp
    );
  }, [idToken, lastTimestamp, user?.uid, onRecordingStepsLoaded]);

  useEffect(() => {
    if (recordingId && user) {
      user.getIdToken().then((newIdToken) => {
        fetchRecordingSteps(
          user.uid,
          newIdToken,
          recordingId,
          recordingsLimit,
          onRecordingStepsLoaded
        );
        setIdToken(newIdToken);
      });
    }
  }, [user, recordingId, onRecordingStepsLoaded]);

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
      !isLoadingRecordingSteps &&
      !allRecordingStepsLoaded
    ) {
      const lastIdElement = document.getElementById(`recording-step-${lastId}`);
      if (
        lastIdElement &&
        lastIdElement.getBoundingClientRect().bottom <= window.innerHeight
      ) {
        loadNewRecordingSteps();
      }
    }
  }, [
    lastId,
    scrollPosition,
    isLoadingRecordingSteps,
    loadNewRecordingSteps,
    allRecordingStepsLoaded,
  ]);

  if (
    loading ||
    (user && isLoadingRecordingSteps && recordingSteps.length === 0)
  ) {
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

  if (!isLoadingRecordingSteps && recordingSteps.length === 0) {
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
          sessionId={recordingId}
          userId={user?.uid as string}
          idToken={idToken}
        />
      </div>
      <RecordingStepsList recordingSteps={recordingSteps} />
      {recordingSteps.length > 0 && isLoadingRecordingSteps && (
        <Loading wrapperClassName="flex flex-col items-center justify-center mt-2" />
      )}
    </div>
  );
};

export default RecordingSteps;
