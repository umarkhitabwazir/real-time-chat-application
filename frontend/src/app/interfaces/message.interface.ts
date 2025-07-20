export interface Message {
  _id?: string;
  sender: {_id:string, username: string, avatar?: string };
  receiver: {_id:string, username: string, avatar?: string };
   deleteForEveryone?: boolean;
    deleteForMe?: boolean;
  content: string;
  unsend?: boolean;
  createdAt?: Date

}