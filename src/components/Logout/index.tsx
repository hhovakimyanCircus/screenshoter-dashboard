import React, { useCallback } from 'react';

import { Auth } from '@firebase/auth';

type LogoutProps = {
  auth: Auth;
};

const Logout: React.FC<LogoutProps> = ({ auth }) => {
  const signOut = useCallback(() => {
    auth.signOut();
    const event = new CustomEvent('MY_SCREENSHOTER_LOGOUT');
    window.dispatchEvent(event);
  }, [auth]);

  return (
    <a
      onClick={signOut}
      className="p-2 w-28 text-base text-center text-white bg-blue-500 rounded cursor-pointer"
    >
      Sign Out
    </a>
  );
};

export default Logout;
