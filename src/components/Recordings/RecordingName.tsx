import React, { useCallback, useState } from 'react';

import CheckIcon from '@/components/base/icons/Check';
import EditIcon from '@/components/base/icons/Edit';
import { updateSession } from '@/firebase';

type RecordingNameProps = {
  sessionId: string;
  userId: string;
  idToken: string;
  currentName: string;
};

const RecordingName: React.FC<RecordingNameProps> = ({
  sessionId,
  userId,
  idToken,
  currentName,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(currentName);

  const updateRecordingName = useCallback(() => {
    setIsEditing(false);
    updateSession(userId, idToken, sessionId, {
      name: inputValue,
    });
  }, [userId, idToken, sessionId, inputValue]);

  return isEditing ? (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={(event) => {
          setInputValue(event.target.value);
        }}
        className="text-2xl font-bold text-[#74737A]"
        placeholder="Type recording name"
      />
      <button
        type="button"
        className="absolute top-[calc(50%-12px)] right-3"
        onClick={updateRecordingName}
      >
        <CheckIcon width={24} height={24} stroke="#FF5C77" />
      </button>
    </div>
  ) : (
    <div className="flex gap-x-4 items-center">
      <div className="text-2xl font-bold text-[#74737A]">
        {inputValue || '[Untitled process]'}
      </div>
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
      </div>
    </div>
  );
};

export default RecordingName;
