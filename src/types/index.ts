export type FirebaseRecording = {
  clickedElementName: string;
  image: string;
  timestamp: number;
  url: string;
};

export type Recording = {
  clickedElementName: string;
  image: string;
  timestamp: number;
  url: string;
  id: string;
};

export type RecordingFirebaseResponse = { [key: string]: FirebaseRecording };

export type SessionFirebaseResponse = {
  sharable?: boolean;
  shareMethod?: string;
};
