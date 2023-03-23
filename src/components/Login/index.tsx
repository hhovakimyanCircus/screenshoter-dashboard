import React, { useCallback } from 'react';

import { Auth, GoogleAuthProvider, signInWithPopup } from '@firebase/auth';

type LoginProps = {
  auth: Auth;
};

const Login: React.FC<LoginProps> = ({ auth }) => {
  const provider = new GoogleAuthProvider();

  const signIn = useCallback(async () => {
    const result = await signInWithPopup(auth, provider);
    // @ts-ignore
    const accessToken = result?.user?.accessToken;
    const userId = result?.user?.uid;
    if (chrome.runtime && userId && accessToken) {
      chrome.runtime.sendMessage(process.env.NEXT_PUBLIC_EXTENSION_ID, {
        event: 'LOGIN',
        userId,
        accessToken,
      });
    }
  }, [auth, provider]);

  return (
    <>
      <h2 className="text-xl font-bold text-center">
        Sign In to Use The Extension
      </h2>
      <a
        onClick={signIn}
        className="p-2 w-48 text-center text-white bg-blue-600 rounded-md cursor-pointer"
      >
        Sign In/Up with Google
      </a>
    </>
  );
};

export default Login;
