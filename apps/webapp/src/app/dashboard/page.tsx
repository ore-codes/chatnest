"use client";

import RoomList from "@/chunks/chat/room-list";
import ChatBox from "@/chunks/chat/chat-box";
import { chatService } from "@/lib/chat/ChatService";
import useRxState from "@/lib/storage/useRxState";

const DashboardPage = () => {
  const activeRoom = useRxState(chatService.activeRoom.data$);
  return (
    <div className="flex h-screen">
      <RoomList />
      <div className="flex flex-col flex-grow bg-gray-100">
        {activeRoom ? (
          <ChatBox />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a chat room to start chatting.
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
