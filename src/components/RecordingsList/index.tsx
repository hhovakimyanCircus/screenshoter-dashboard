import React, { useCallback } from 'react';

import Step from '@/components/RecordingsList/Step';
import { RecordingStep } from '@/types';

type RecordingStepsListProps = {
  recordingSteps: RecordingStep[];
  owner?: boolean;
  updateStepData?: (
    stepId: string,
    dataToUpdate: Record<string, unknown>
  ) => void;
};

const RecordingStepsList: React.FC<RecordingStepsListProps> = ({
  recordingSteps,
  owner = false,
  updateStepData,
}) => {
  const updateStepClickedElementName = useCallback(
    (stepId: string, newElementName: string) => {
      if (updateStepData) {
        updateStepData(stepId, { clickedElementName: newElementName });
      }
    },
    [updateStepData]
  );

  return (
    <div>
      {recordingSteps.map((recording, index) => {
        let recordingLink = <></>;
        if (
          (index === 0 ||
            recordingSteps[index].url !== recordingSteps[index - 1].url) &&
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

        return (
          <React.Fragment key={`recording-${recording.id}`}>
            {recordingLink}
            <Step
              step={recording}
              owner={owner}
              updateData={updateStepClickedElementName}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default RecordingStepsList;
