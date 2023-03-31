import { initializeApp } from 'firebase/app';

import { RecordingFirebaseResponse } from '@/types';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const fetchRecordings = (
  userId: string,
  token: string | null,
  sessionId: string,
  limit: number,
  successCallback: (result: RecordingFirebaseResponse | null) => void,
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
    `${process.env.NEXT_PUBLIC_DATABASE_URL}/users/${userId}/${sessionId}/.json?${queryString}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
    .then((response) => response.json())
    .then((result: RecordingFirebaseResponse | null) => {
      successCallback(result);
    });
};

export default function initFirebase() {
  return app;
}
