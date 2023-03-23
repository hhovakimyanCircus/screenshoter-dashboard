import React, { useCallback } from 'react';

import { Auth } from '@firebase/auth';

type LogoutProps = {
  auth: Auth;
};

const Logout: React.FC<LogoutProps> = ({ auth }) => {
  const signOut = useCallback(() => {
    auth.signOut();
    if (chrome.runtime) {
      chrome.runtime.sendMessage(process.env.NEXT_PUBLIC_EXTENSION_ID, {
        event: 'LOGOUT',
      });
    }
  }, [auth]);

  return (
    <a
      onClick={signOut}
      className="p-2 w-48 text-center text-white bg-blue-600 rounded-md cursor-pointer"
    >
      Sign Out
    </a>
  );
};

export default Logout;
