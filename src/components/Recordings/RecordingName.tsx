import React, { useCallback, useState } from 'react';

import CheckIcon from '@/components/base/icons/Check';
import EditIcon from '@/components/base/icons/Edit';

const RecordingName = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');

  const updateRecordingName = useCallback(() => {}, []);

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
