import React, { useCallback } from 'react';

import { Modal } from 'flowbite-react';

type ShareRecordingModalProps = {
  show: boolean;
  recordingName: string;
  url: string;
  onClose: () => void;
  onSubmit: () => void;
};

const ShareRecordingModal: React.FC<ShareRecordingModalProps> = ({
  show,
  recordingName,
  url,
  onClose,
  onSubmit,
}) => {
  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(url);
    onSubmit();
  }, [url, onSubmit]);

  return (
    <Modal
      show={show}
      size="3xl"
      popup={true}
      onClose={onClose}
      className="w-full"
    >
      <Modal.Header />
      <Modal.Body>
        <div className="flex flex-col items-center px-2 pb-4 space-y-6 sm:pb-6 lg:px-2 xl:pb-8">
          <h3 className="text-[17px] font-bold text-[#74737A]">Share</h3>
          <p className="!mt-0 text-[17px] text-[#74737A] border-[#74737A]">
            Share <span className="font-bold">{recordingName}</span>
            process.
          </p>
          <input
            type="text"
            value={url}
            readOnly={true}
            className="block p-4 !mt-16 w-full text-[#74737A] rounded-md focus:border-[#74737A] focus:outline-0 focus:outline-offset-0	focus:ring-0"
          />
          <button
            className="p-2 !mt-20 w-48 text-lg text-center text-[#fff] bg-[#FF5C77] rounded-md"
            onClick={copyLink}
          >
            Copy link
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ShareRecordingModal;
