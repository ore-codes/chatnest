export type Room = {
  room: {
    id: string;
    name: string;
  };
  unreadCount: number;
  lastMessage: {
    text: string;
    timestamp: string;
  };
};

export type Message = {
  id: string;
  text: string;
  timestamp: string;
  sender: {
    username: string;
  };
};
