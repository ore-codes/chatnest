"use client";

import { useState } from "react";
import RoomList from "@/chunks/chat/room-list";
import ChatBox from "@/chunks/chat/chat-box";
import { chatService } from "@/lib/chat/ChatService";
import useRxState from "@/lib/storage/useRxState";
import { Icon } from "@iconify/react";

const DashboardPage = () => {
  const activeRoom = useRxState(chatService.activeRoom.data$);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <div className="hidden md:block w-64 bg-primary text-white">
        <RoomList />
      </div>
      <button
        onClick={() => setIsDrawerOpen((isOpen) => !isOpen)}
        className="absolute top-4 left-4 md:hidden z-50 bg-primary text-white p-2 rounded-lg"
      >
        <Icon icon="typcn:th-menu" className="size-5" />
      </button>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity ${
          isDrawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } md:hidden`}
        onClick={() => setIsDrawerOpen(false)}
      />
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-primary text-white shadow-lg transform transition-transform ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <button
          onClick={() => setIsDrawerOpen(false)}
          className="absolute top-4 right-4 text-white"
        >
          <Icon icon="fa:times" className="size-5" />
        </button>
        <RoomList />
      </div>
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
