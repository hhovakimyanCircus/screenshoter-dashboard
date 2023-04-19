import React, { useCallback, useState } from 'react';

import CheckIcon from '@/components/base/icons/Check';
import DeleteIcon from '@/components/base/icons/Delete';
import EditIcon from '@/components/base/icons/Edit';
import { RecordingStep } from '@/types';

type StepProps = {
  step: RecordingStep;
  owner: boolean;
  updateData: (stepId: string, newElementName: string) => void;
  deleteStep: (stepId: string) => void;
};

const Step: React.FC<StepProps> = ({ step, owner, updateData, deleteStep }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(step.clickedElementName);

  const updateClickedElementName = useCallback(() => {
    setIsEditing(false);
    updateData(step.id, inputValue);
  }, [updateData, inputValue]);

  return (
    <div
      id={`recording-step-${step.id}`}
      className="py-10 px-20 mt-10 w-full bg-white rounded-lg border"
    >
      <div className="mb-4">
        {isEditing ? (
          <div className="relative">
            <input
              value={inputValue}
              onChange={(event) => {
                setInputValue(event.target.value);
              }}
              className="py-3 px-3 w-full rounded-md border border-[#74737A]"
              placeholder="Type new name for clicked element"
              onBlur={() => {
                setIsEditing(false);
              }}
              autoFocus={true}
            />
            <button
              type="button"
              className="absolute top-[calc(50%-12px)] right-3"
              onClick={updateClickedElementName}
            >
              <CheckIcon width={24} height={24} stroke="#FF5C77" />
            </button>
          </div>
        ) : (
          <div className="flex gap-x-4 items-center">
            <div className="text-[#74737A]">
              {inputValue ? `Clicked: ${inputValue}` : 'Clicked here'}
            </div>
            {owner && (
              <div className="flex" style={{ gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(true);
                  }}
                  title="Edit clicked element name"
                >
                  <EditIcon width={20} height={20} stroke="#FF5C77" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteStep(step.id);
                  }}
                  title="Delete step"
                >
                  <DeleteIcon width={20} height={20} stroke="#FF5C77" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <img src={step.image} alt="" className="w-full" />
    </div>
  );
};

export default Step;
