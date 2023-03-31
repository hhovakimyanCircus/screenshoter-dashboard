import { getAuth } from '@firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

import Loading from '@/components/base/Loading';
import Login from '@/components/Login';
import Logout from '@/components/Logout';
import initFirebase from '@/firebase';

const GoogleAuth = () => {
  initFirebase();
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <Loading wrapperClassName="mx-10" iconClassName="w-6 h-6 fill-blue-500" />
    );
  }

  return user ? <Logout auth={auth} /> : <Login auth={auth} />;
};

export default GoogleAuth;
