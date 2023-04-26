import React, { useCallback } from 'react';

import { updateSession } from '@/firebase';

type ShareRecordingButtonProps = {
  sessionId: string;
  userId: string;
  idToken: string;
  openShareRecordingModal: () => void;
};

const ShareRecordingButton: React.FC<ShareRecordingButtonProps> = ({
  sessionId,
  userId,
  idToken,
  openShareRecordingModal,
}) => {
  const buildRecordingShareLink = useCallback(() => {
    updateSession(userId, idToken, sessionId, {
      sharable: true,
      shareMethod: 'public',
    });
    openShareRecordingModal();
  }, [sessionId, userId, idToken, openShareRecordingModal]);

  return (
    <a
      className="flex justify-center p-2 w-28 text-lg font-bold text-center text-white bg-[#FF5C77] rounded-lg cursor-pointer"
      onClick={buildRecordingShareLink}
    >
      Share
    </a>
  );
};

export default ShareRecordingButton;
