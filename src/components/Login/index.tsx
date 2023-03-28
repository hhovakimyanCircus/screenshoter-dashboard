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
    const refreshToken = result?.user?.stsTokenManager?.refreshToken;
    const userId = result?.user?.uid;

    if (chrome.runtime && userId && refreshToken) {
      chrome.runtime.sendMessage(process.env.NEXT_PUBLIC_EXTENSION_ID, {
        event: 'LOGIN',
        userId,
        refreshToken,
      });
    }
  }, [auth, provider]);

  return (
    <a
      onClick={signIn}
      className="p-2 w-48 text-center text-white bg-blue-500 rounded cursor-pointer"
    >
      Sign In/Up with Google
    </a>
  );
};

export default Login;
