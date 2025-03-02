
// Define types for message handling
export interface MessageType {
  id: string;
  sender: 'me' | 'them';
  content: string;
  time: string;
  read: boolean;
  date: string;
}

export interface ConversationType {
  id: string;
  name: string;
  avatar: string;
  role: string;
  company: string;
  status: 'online' | 'offline';
  lastMessage: string;
  time: string;
  unread: number;
  isActive: boolean;
}

export interface GroupedMessages {
  [key: string]: MessageType[];
}
