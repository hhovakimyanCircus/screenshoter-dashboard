import React, { useCallback } from 'react';

import { Button, Tooltip } from 'flowbite-react';

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
      <Button color="success" onClick={buildRecordingShareLink}>
        Get Sharable Link
      </Button>
    </Tooltip>
  );
};

export default ShareRecordingButton;
