export interface User {
   user?:{ _id: string;
  username?: string;
  email: string;
  password: string;
  avatar?: string;
  refreshToken?: string;
  status?: 'online' | 'offline' | 'away';
  lastSeen?: Date;
  socketId?: string;} | null;
}




