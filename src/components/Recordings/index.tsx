import React, { useCallback, useEffect, useState } from 'react';

import Loading from '@/components/base/Loading';
import RecordingName from '@/components/Recordings/RecordingName';
import RecordingStepsList from '@/components/RecordingsList';
import {
  fetchRecordingSteps,
  updateStep,
  deleteStep,
  fetchRecordingDetails,
} from '@/firebase';
import {
  RecordingDetailsFirebaseResponse,
  RecordingStep,
  RecordingStepsFirebaseResponse,
} from '@/types';

type RecordingStepsProps = {
  recordingId: string;
  userId?: string;
  idToken: string;
  isAuthInfoLoading: boolean;
};

const recordingsLimit = 2;

const RecordingSteps: React.FC<RecordingStepsProps> = ({
  recordingId,
  userId,
  idToken,
  isAuthInfoLoading,
}) => {
  const [recordingSteps, setRecordingSteps] = useState<RecordingStep[]>([]);
  const [recordingDetails, setRecordingDetails] =
    useState<RecordingDetailsFirebaseResponse>({});
  const [isLoadingRecordingSteps, setIsLoadingRecordingSteps] =
    useState<boolean>(true);
  const [lastId, setLastId] = useState<string>('');
  const [lastTimestamp, setLastTimestamp] = useState<number>(0);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [allRecordingStepsLoaded, setAllRecordingStepsLoaded] =
    useState<boolean>(false);
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

  const loadNewRecordingSteps = useCallback(() => {
    setIsLoadingRecordingSteps(true);
    fetchRecordingSteps(
      userId as string,
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
  }, [idToken, lastTimestamp, userId, onRecordingStepsLoaded]);

  const updateStepData = useCallback(
    (stepId: string, dataToUpdate: Record<string, unknown>) => {
      updateStep(userId as string, idToken, recordingId, stepId, dataToUpdate);
    },
    [idToken, userId, recordingId]
  );

  const deleteStepData = useCallback(
    (stepId: string) => {
      deleteStep(userId as string, idToken, recordingId, stepId, () => {
        const newRecordingSteps = recordingSteps.filter(
          (recordingStep) => recordingStep.id !== stepId
        );
        setRecordingSteps(newRecordingSteps);
      });
    },
    [idToken, userId, recordingId, recordingSteps]
  );

  useEffect(() => {
    if (recordingId && userId && idToken) {
      fetchRecordingSteps(
        userId,
        idToken,
        recordingId,
        recordingsLimit,
        onRecordingStepsLoaded
      );
    }
  }, [userId, recordingId, idToken, onRecordingStepsLoaded]);

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

  useEffect(() => {
    if (userId && recordingId) {
      fetchRecordingDetails(userId, recordingId, (result) => {
        setIsLoadingRecordingDetails(false);
        if (result) {
          setRecordingDetails(result);
        }
      });
    }
  }, [userId, recordingId]);

  if (
    isAuthInfoLoading ||
    (userId && isLoadingRecordingSteps && recordingSteps.length === 0) ||
    (userId && isLoadingRecordingDetails)
  ) {
    return (
      <Loading
        wrapperClassName="flex flex-col items-center h-[calc(100vh-72px)] justify-center"
        iconClassName="w-20 h-20 fill-blue-500"
      />
    );
  }

  if (!isAuthInfoLoading && !userId) {
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
      <div className="flex items-center mt-16">
        <RecordingName
          sessionId={recordingId}
          userId={userId as string}
          idToken={idToken}
          currentName={recordingDetails?.name || ''}
        />
      </div>
      <RecordingStepsList
        recordingSteps={recordingSteps}
        owner={true}
        updateStepData={updateStepData}
        deleteStepData={deleteStepData}
      />
      {recordingSteps.length > 0 && isLoadingRecordingSteps && (
        <Loading wrapperClassName="flex flex-col items-center justify-center mt-2" />
      )}
    </div>
  );
};

export default RecordingSteps;
