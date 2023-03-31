import React, { useCallback, useEffect, useState } from 'react';

import Loading from '@/components/base/Loading';
import RecordingsList from '@/components/RecordingsList';
import { fetchRecordings, fetchSessionDetails } from '@/firebase';
import { Recording, RecordingFirebaseResponse } from '@/types';

type SharedRecordingsProps = {
  sessionId: string;
  sharerUserId: string;
};

const SharedRecordings: React.FC<SharedRecordingsProps> = ({
  sessionId,
  sharerUserId,
}) => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isLoadingRecordings, setIsLoadingRecordings] = useState<boolean>(true);
  const [lastId, setLastId] = useState<string>('');
  const [lastTimestamp, setLastTimestamp] = useState<number>(0);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [allRecordingsLoaded, setAllRecordingsLoaded] =
    useState<boolean>(false);
  const [allowedToView, setAllowedToView] = useState<boolean>(false);
  const [loadingSessionDetails, setLoadingSessionDetails] =
    useState<boolean>(true);
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
    if (sharerUserId) {
      fetchRecordings(
        sharerUserId,
        null,
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
    }
  }, [lastTimestamp, onRecordingsLoaded, sharerUserId]);

  useEffect(() => {
    if (sessionId && sharerUserId && allowedToView) {
      fetchRecordings(
        sharerUserId,
        null,
        sessionId,
        recordingsLimit,
        onRecordingsLoaded
      );
    }
  }, [sessionId, onRecordingsLoaded, sharerUserId, allowedToView]);

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

  useEffect(() => {
    if (sharerUserId && sessionId) {
      fetchSessionDetails(sharerUserId, sessionId, (result) => {
        setLoadingSessionDetails(false);
        if (result?.sharable) {
          setAllowedToView(true);
        }
      });
    }
  }, [sharerUserId, sessionId]);

  if (!loadingSessionDetails && !allowedToView) {
    return (
      <div className="pt-20 h-[calc(100vh-72px)] text-center">
        <span className="text-2xl text-yellow-300">
          Access denied: You do not have access to this recording
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
      <RecordingsList recordings={recordings} />
      {recordings.length > 0 && isLoadingRecordings && (
        <Loading wrapperClassName="flex flex-col items-center justify-center mt-2" />
      )}
    </div>
  );
};

export default SharedRecordings;
