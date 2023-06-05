import React from 'react';

import { useUser } from '@auth0/nextjs-auth0/client';
import Head from 'next/head';

import Loading from '@/components/base/Loading';
import Dashboard from '@/components/Dashboard';
import Header from '@/components/Header';

export default function Home() {
  const { user, isLoading, error } = useUser();

  if (isLoading) {
    return (
      <Loading
        wrapperClassName="flex flex-col items-center h-[calc(100vh-72px)] justify-center"
        iconClassName="w-20 h-20 fill-blue-500"
      />
    );
  }

  if (error) return <div>{error.message}</div>;

  return (
    <>
      <Head>
        <title>My Screenshot extension dashboard</title>
        <meta
          name="description"
          content="Dashboard of My Screenshot extension"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header user={user} />
      <Dashboard />
    </>
  );
}
