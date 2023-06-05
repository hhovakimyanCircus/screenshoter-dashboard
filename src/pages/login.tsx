import { useEffect } from 'react';

import { getAuth, signInWithCustomToken } from '@firebase/auth';
import { useRouter } from 'next/router';

import Loading from '@/components/base/Loading';
import initFirebase from '@/firebase';

const Login = () => {
  const { push } = useRouter();
  useEffect(() => {
    const getAccessToken = async () => {
      fetch('/api/request-token').then(async (res) => {
        const response = await res.json();
        initFirebase();

        const auth = getAuth();
        const result = await signInWithCustomToken(
          auth,
          response.customToken as string
        );

        // @ts-ignore
        const refreshToken = result?.user?.stsTokenManager?.refreshToken;
        const userId = result?.user?.uid;

        if (userId && refreshToken) {
          const event = new CustomEvent('MY_SCREENSHOTER_LOGIN', {
            detail: {
              userId,
              refreshToken,
              userName: response.userName,
            },
          });

          window.dispatchEvent(event);
          push('/');
        }
      });
    };

    getAccessToken();
  }, []);

  return (
    <Loading
      wrapperClassName="flex flex-col items-center h-screen justify-center items-center"
      iconClassName="w-20 h-20 fill-blue-500"
    />
  );
};

export default Login;
