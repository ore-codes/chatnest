"use client";

import { useState } from "react";
import useRxState from "@/lib/storage/useRxState";
import { chatService } from "@/lib/chat/ChatService";
import { useChatSocket } from "@/lib/chat/useChatSocket";
import { ChatEvents } from "@/lib/chat/chat.types";

const MessageInput = () => {
  const activeRoom = useRxState(chatService.activeRoom.data$);
  const { socket } = useChatSocket();
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!activeRoom || message.trim() === "") return;
    socket?.emit(ChatEvents.SEND_MESSAGE, {
      room: activeRoom.id,
      text: message,
    });
    setMessage("");
  };

  return (
    <div className="p-4 bg-white flex items-center border-t">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-grow p-3 border rounded-lg focus:outline-none"
        placeholder="Type a message..."
      />
      <button
        onClick={handleSend}
        className="ml-3 px-5 py-3 bg-primary text-white rounded-lg hover:brightness-90"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
