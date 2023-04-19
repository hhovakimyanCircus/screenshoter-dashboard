import React, { useCallback } from 'react';

import { Tooltip } from 'flowbite-react';

import { updateSession } from '@/firebase';

type ShareRecordingButtonProps = {
  sessionId: string;
  userId: string;
  idToken: string;
};

const ShareRecordingButton: React.FC<ShareRecordingButtonProps> = ({
  sessionId,
  userId,
  idToken,
}) => {
  const buildRecordingShareLink = useCallback(() => {
    updateSession(
      userId,
      idToken,
      sessionId,
      {
        sharable: true,
        shareMethod: 'public',
      },
      () => {
        navigator.clipboard.writeText(
          `https://screenshoter-dfcd1.web.app/recording/shared/${userId}/${sessionId}`
        );
      }
    );
  }, [sessionId, userId, idToken]);

  return (
    <Tooltip content="URL copied to clipboard" trigger="click">
      <a
        className="flex justify-center p-2 w-28 text-lg font-bold text-center text-white bg-[#FF5C77] rounded-lg cursor-pointer"
        onClick={buildRecordingShareLink}
      >
        Share
      </a>
    </Tooltip>
  );
};

export default ShareRecordingButton;
