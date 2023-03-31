import React, { useCallback } from 'react';

import { Button, Tooltip } from 'flowbite-react';

type ShareRecordingButtonProps = {
  sessionId: string;
  userId: string;
};

const ShareRecordingButton: React.FC<ShareRecordingButtonProps> = ({
  sessionId,
  userId,
}) => {
  const buildRecordingShareLink = useCallback(() => {
    navigator.clipboard.writeText(
      `https://screenshoter-dfcd1.web.app/recording/shared/${userId}/${sessionId}`
    );
  }, [sessionId, userId]);

  return (
    <Tooltip content="URL copied to clipboard" trigger="click">
      <Button color="success" onClick={buildRecordingShareLink}>
        Get Sharable Link
      </Button>
    </Tooltip>
  );
};

export default ShareRecordingButton;
