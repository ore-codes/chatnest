import { gql } from "@apollo/client";

export const GetJoinedRooms = gql`
  query GetJoinedRooms {
    getJoinedRooms {
      room {
        id
        name
      }
      unreadCount
      lastMessage {
        text
        timestamp
      }
    }
  }
`;

export const GetRoomByName = gql`
  query GetRoom($name: String!) {
    getRoom(name: $name) {
      id
      name
    }
  }
`;

export const GetRoomMessages = gql`
  query GetRoomMessages($roomId: String!) {
    roomMessages(room: $roomId, limit: 50) {
      id
      text
      timestamp
      sender {
        username
      }
    }
  }
`;

export const JoinRoomMutation = gql`
  mutation JoinRoom($name: String!) {
    joinRoom(name: $name) {
      id
      name
    }
  }
`;

export const MarkMessagesAsRead = gql`
  mutation MarkMessagesAsRead($roomId: String!) {
    markMessagesAsRead(roomId: $roomId)
  }
`;
