import React, { useCallback, useEffect, useState } from 'react';

import Loading from '@/components/base/Loading';
import RecordingStepsList from '@/components/RecordingsList';
import { fetchRecordingSteps, fetchRecordingDetails } from '@/firebase';
import { RecordingStep, RecordingStepsFirebaseResponse } from '@/types';

type SharedRecordingsProps = {
  recordingId: string;
  sharerUserId: string;
};

const recordingStepsLimit = 2;

const SharedRecordings: React.FC<SharedRecordingsProps> = ({
  recordingId,
  sharerUserId,
}) => {
  const [recordingSteps, setRecordingSteps] = useState<RecordingStep[]>([]);
  const [isLoadingRecordingSteps, setIsLoadingRecordingSteps] =
    useState<boolean>(true);
  const [lastId, setLastId] = useState<string>('');
  const [lastTimestamp, setLastTimestamp] = useState<number>(0);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [allRecordingStepsLoaded, setAllRecordingStepsLoaded] =
    useState<boolean>(false);
  const [allowedToView, setAllowedToView] = useState<boolean>(false);
  const [isLoadingRecordingDetails, setIsLoadingRecordingDetails] =
    useState<boolean>(true);

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

  const loadNewRecordings = useCallback(() => {
    setIsLoadingRecordingSteps(true);
    if (sharerUserId) {
      fetchRecordingSteps(
        sharerUserId,
        null,
        recordingId,
        recordingStepsLimit,
        (result: RecordingStepsFirebaseResponse | null) => {
          onRecordingStepsLoaded(result);
          if (!result) {
            setAllRecordingStepsLoaded(true);
          }
        },
        lastTimestamp
      );
    }
  }, [lastTimestamp, onRecordingStepsLoaded, sharerUserId]);

  useEffect(() => {
    if (recordingId && sharerUserId && allowedToView) {
      fetchRecordingSteps(
        sharerUserId,
        null,
        recordingId,
        recordingStepsLimit,
        onRecordingStepsLoaded
      );
    }
  }, [recordingId, onRecordingStepsLoaded, sharerUserId, allowedToView]);

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
        loadNewRecordings();
      }
    }
  }, [
    lastId,
    scrollPosition,
    isLoadingRecordingSteps,
    loadNewRecordings,
    allRecordingStepsLoaded,
  ]);

  useEffect(() => {
    if (sharerUserId && recordingId) {
      fetchRecordingDetails(sharerUserId, recordingId, (result) => {
        setIsLoadingRecordingDetails(false);
        if (result?.sharable) {
          setAllowedToView(true);
        }
      });
    }
  }, [sharerUserId, recordingId]);

  if (!isLoadingRecordingDetails && !allowedToView) {
    return (
      <div className="pt-20 h-[calc(100vh-72px)] text-center">
        <span className="text-2xl text-yellow-300">
          Access denied: You do not have access to this recording
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
      <RecordingStepsList recordingSteps={recordingSteps} />
      {recordingSteps.length > 0 && isLoadingRecordingSteps && (
        <Loading wrapperClassName="flex flex-col items-center justify-center mt-2" />
      )}
    </div>
  );
};

export default SharedRecordings;
