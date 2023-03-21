import { getAuth } from '@firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

import Login from '@/components/Login';
import Logout from '@/components/Logout';
import initFirebase from '@/firebase';

const GoogleAuth = () => {
  initFirebase();
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <></>;
  }

  return user ? <Logout auth={auth} /> : <Login auth={auth} />;
};

export default GoogleAuth;
