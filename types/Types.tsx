export enum PlayerContext {
  TRENDS = 'TRENDS',
  ALBUM = 'ALBUM',
  SEARCH = 'SEARCH',
  FAVORITES = 'FAVORITES',
}

export interface AlbumType {
  title: string;
  artist: string;
  image: string;
  label: string;
  releaseDate: string;
  tracks: TrackType[];
}

export interface TrackType {
  id: string;
  title: string;
  image: string;
  url: string;
  artist: string;
}

export interface SequenceType {
  name?: string;
  albums: TrackType[];
}

export interface UserType {
  id: string;
  email: string;
  username: string;
  createAt: string;
}

export interface ConnectedOnlineType {
  id: string;
  email: string;
  username: string;
  socketId: string | null;
}

export interface ChatMessageType {
  messageId: string;
  message: string;
  sender: string;
  recipient: string;
  timestamp: string;
  userA?: number;
  userB?: number;
  title?: string;
  artist?: string;
  image?: string;
  url?: string;
}

export interface ChatDictType {
  [userId: number]: ChatMessageType[];
}

export interface ModalMessageType {
  message: string;
  field?: string;
}

export interface MicRecordType {
  recognized: string;
  pitch: string;
  error: string;
  end: string;
  started: boolean;
  results: string[];
  partialsResults: string[];
  isRecording: boolean;
}
