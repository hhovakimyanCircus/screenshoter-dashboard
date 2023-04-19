import React from 'react';

import classNames from 'classnames';
import Link from 'next/link';

import GoogleAuth from '@/components/GoogleAuth';
import ShareRecordingButton from '@/components/Recordings/ShareRecordingButton';

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
          {showShareRecordingBtn && (
            <ShareRecordingButton
              sessionId={sessionId}
              userId={userId}
              idToken={idToken}
            />
          )}
          <GoogleAuth />
        </div>
      </div>
    </header>
  );
};

export default Header;
