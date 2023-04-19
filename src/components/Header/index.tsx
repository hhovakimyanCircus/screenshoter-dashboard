import React from 'react';

import classNames from 'classnames';
import Link from 'next/link';

import GoogleAuth from '@/components/GoogleAuth';

type HeaderProps = {
  sessionId?: string;
  userId?: string;
  idToken?: string;
};

const Header: React.FC<HeaderProps> = ({ sessionId, userId, idToken }) => {
  const showShareRecordingBtn = sessionId && userId && idToken;

  return (
    <header className="fixed top-0 z-30 py-4 px-6 w-screen bg-white border-b">
      <div className="flex justify-between items-center px-4">
        <div>
          <Link href="/" className="font-mono text-xl">
            My ScreenShot
          </Link>
        </div>
        <div
          className={classNames('flex', showShareRecordingBtn ? 'gap-3.5' : '')}
        >
          <div id="share_recording_btn"></div>
          <GoogleAuth />
        </div>
      </div>
    </header>
  );
};

export default Header;
