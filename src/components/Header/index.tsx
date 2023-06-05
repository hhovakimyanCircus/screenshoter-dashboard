import React from 'react';

import { UserProfile } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';

type HeaderProps = {
  user: UserProfile | undefined;
};

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="fixed top-0 z-30 py-4 px-6 w-screen bg-white border-b">
      <div className="flex justify-between items-center px-4">
        <div>
          <Link href="/" className="font-mono text-xl">
            My ScreenShot
          </Link>
        </div>
        {user ? (
          <Link href="/api/auth/logout">Log Out</Link>
        ) : (
          <Link href="/api/auth/login">Log In</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
