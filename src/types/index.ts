export type FirebaseRecordingStep = {
  clickedElementName: string;
  image: string;
  timestamp: number;
  url: string;
};

export type RecordingStep = {
  clickedElementName: string;
  image: string;
  timestamp: number;
  url: string;
  id: string;
};

export type RecordingStepsFirebaseResponse = {
  [key: string]: FirebaseRecordingStep;
};

export type RecordingDetailsFirebaseResponse = {
  sharable?: boolean;
  shareMethod?: string;
  name?: string;
};
