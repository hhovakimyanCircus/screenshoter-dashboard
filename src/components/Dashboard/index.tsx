import React from 'react';

import { getAuth } from '@firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

import Loading from '@/components/Loading';

const Dashboard = () => {
  const auth = getAuth();
  const [, loading] = useAuthState(auth);

  if (loading) {
    return (
      <Loading
        wrapperClassName="flex flex-col items-center h-[calc(100vh-72px)] justify-center"
        iconClassName="w-20 h-20 fill-blue-500"
      />
    );
  }

  return (
    <main className="h-screen bg-slate-50">
      <div className="flex flex-col gap-4 items-center px-10 pt-40">
        <h1 className="text-3xl font-bold text-center">
          Welcome to My Screenshot dashboard
        </h1>
      </div>
    </main>
  );
};

export default Dashboard;
