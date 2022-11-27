export interface User {
  username: string;
  displayPicture: string;
  platform: string;
  joinedAt: Date;
  isConnected: boolean;
  socketID: string;
}

export interface IncommingCall {
  from: string;
  user: User;
  offer: RTCSessionDescriptionInit
}