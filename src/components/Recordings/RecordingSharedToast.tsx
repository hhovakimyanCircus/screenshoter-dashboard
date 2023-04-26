import { Toast } from 'flowbite-react';

const RecordingSharedToast = () => {
  return (
    <div className="fixed top-4 left-[calc(50%-152px)] z-[999]">
      <Toast>
        <div className="ml-3 text-sm font-normal">
          Recording URL is copied to clipboard.
        </div>
        <Toast.Toggle />
      </Toast>
    </div>
  );
};

export default RecordingSharedToast;
