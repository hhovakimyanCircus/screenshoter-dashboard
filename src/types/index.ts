export type FirebaseRecording = {
  sessionId: string;
  clickedElementName: string;
  image: string;
  date: string;
  url: string;
};

export type Recording = {
  clickedElementName: string;
  image: string;
  date: string;
  url: string;
  id: string;
};

export type RecordingFirebaseResponse = { [key: string]: FirebaseRecording };
