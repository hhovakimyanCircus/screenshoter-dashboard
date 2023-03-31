import { initializeApp } from 'firebase/app';

import {
  RecordingStepsFirebaseResponse,
  RecordingDetailsFirebaseResponse,
} from '@/types';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const fetchRecordingSteps = (
  userId: string,
  token: string | null,
  sessionId: string,
  limit: number,
  successCallback: (result: RecordingStepsFirebaseResponse | null) => void,
  lastTimestamp?: number
) => {
  const queryParams: { [key: string]: string | number } = {
    orderBy: '"timestamp"',
    limitToFirst: limit,
  };

  if (token) {
    queryParams.auth = token;
  }

  if (lastTimestamp) {
    queryParams.startAt = lastTimestamp + 1;
  }

  const queryString = Object.keys(queryParams)
    .map(
      (k) => `${encodeURIComponent(k)}=${encodeURIComponent(queryParams[k])}`
    )
    .join('&');

  fetch(
    `${process.env.NEXT_PUBLIC_DATABASE_URL}/users/${userId}/${sessionId}/steps.json?${queryString}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
    .then((response) => response.json())
    .then((result: RecordingStepsFirebaseResponse | null) => {
      successCallback(result);
    });
};

export const fetchRecordingDetails = (
  userId: string,
  sessionId: string,
  successCallback: (result: RecordingDetailsFirebaseResponse) => void
) => {
  fetch(
    `${process.env.NEXT_PUBLIC_DATABASE_URL}/users/${userId}/${sessionId}/details/.json?`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
    .then((response) => response.json())
    .then((result: RecordingDetailsFirebaseResponse) => {
      successCallback(result);
    });
};

export const updateSession = (
  userId: string,
  token: string,
  sessionId: string,
  dataToUpdate: Record<string, unknown>,
  successCallback: () => void
) => {
  const queryParams: { [key: string]: string | number } = {
    auth: token,
  };

  const queryString = Object.keys(queryParams)
    .map(
      (k) => `${encodeURIComponent(k)}=${encodeURIComponent(queryParams[k])}`
    )
    .join('&');

  fetch(
    `${process.env.NEXT_PUBLIC_DATABASE_URL}/users/${userId}/${sessionId}/details/.json?${queryString}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToUpdate),
    }
  )
    .then((response) => response.json())
    .then(() => {
      successCallback();
    });
};

export default function initFirebase() {
  return app;
}
