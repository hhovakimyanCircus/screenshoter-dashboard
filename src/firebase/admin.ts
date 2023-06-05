import admin from 'firebase-admin';

try {
  const config = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY,
  };

  admin.initializeApp({
    credential: admin.credential.cert(config),
    databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
  });
} catch (error) {
  console.error('Firebase admin initialization error', error?.stack);
}

export default admin;
