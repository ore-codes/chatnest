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

export declare enum ChatEvents {
  JOIN_ROOM = "joinRoom",
  SEND_MESSAGE = "sendMessage",
  LEAVE_ROOM = "leaveRoom",
  ERROR = "error",
  MESSAGE = "message",
  ACTIVE_USERS = "activeUsers",
}
