import React from 'react';

import { Recording } from '@/types';

type RecordingsListProps = {
  recordings: Recording[];
};

const RecordingsList: React.FC<RecordingsListProps> = ({ recordings }) => {
  return (
    <div>
      {recordings.map((recording, index) => {
        let recordingLink = <></>;
        if (
          (index === 0 ||
            recordings[index].url !== recordings[index - 1].url) &&
          recording.url
        ) {
          recordingLink = (
            <div
              className="py-5 px-20 mt-10 w-full bg-white rounded-lg border"
              id={`recording-link-${recording.id}`}
            >
              <div className="text-lg text-neutral-700">
                Navigate to{' '}
                <a
                  href={recording.url}
                  target="_blank"
                  className="text-blue-500"
                >
                  {recording.url}
                </a>
              </div>
            </div>
          );
        }

        const recordingStep = (
          <div
            id={`recording-step-${recording.id}`}
            className="py-10 px-20 mt-10 w-full bg-white rounded-lg border"
          >
            <div className="mb-4 text-lg text-neutral-700">
              {recording.clickedElementName}
            </div>
            <img src={recording.image} alt="" className="w-full" />
          </div>
        );

        return (
          <React.Fragment key={`recording-${recording.id}`}>
            {recordingLink}
            {recordingStep}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default RecordingsList;
