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
  deleteStepData?: (stepId: string) => void;
};

const RecordingStepsList: React.FC<RecordingStepsListProps> = ({
  recordingSteps,
  owner = false,
  updateStepData,
  deleteStepData,
}) => {
  const updateStepClickedElementName = useCallback(
    (stepId: string, newElementName: string) => {
      if (updateStepData) {
        updateStepData(stepId, { clickedElementName: newElementName });
      }
    },
    [updateStepData]
  );

  const deleteStep = useCallback(
    (stepId: string) => {
      if (deleteStepData) {
        deleteStepData(stepId);
      }
    },
    [deleteStepData]
  );

  return (
    <div>
      {recordingSteps.map((recording) => {
        return (
          <Step
            step={recording}
            owner={owner}
            updateData={updateStepClickedElementName}
            deleteStep={deleteStep}
            key={`recording-${recording.id}`}
          />
        );
      })}
    </div>
  );
};

export default RecordingStepsList;
