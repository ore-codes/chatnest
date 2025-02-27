"use client";

import { useLazyQuery } from "@apollo/client";
import { GetRoomMessages } from "@/lib/chat/chat.gql";
import MessageInput from "./message-input";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChatEvents, Message } from "@/lib/chat/chat.types";
import useRxState from "@/lib/storage/useRxState";
import { authService } from "@/lib/auth/AuthService";
import { chatService } from "@/lib/chat/ChatService";
import { useChatSocket } from "@/lib/chat/useChatSocket";

const ChatBox = () => {
  const activeRoom = useRxState(chatService.activeRoom.data$);
  const [getRoomMessages, messagesQuery] = useLazyQuery(GetRoomMessages);
  const [messages, setMessages] = useState<Message[]>([]);
  const authUser = useRxState(authService.userStorage.data$);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { socket } = useChatSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on(ChatEvents.MESSAGE, (message) => {
      setMessages((msgs) => [...msgs, message]);
    });

    return () => {
      socket.off(ChatEvents.MESSAGE);
    };
  }, [socket]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (activeRoom) {
      getRoomMessages({
        variables: { roomId: activeRoom.id },
      }).then(({ data }) => {
        setMessages(data.roomMessages);
      });
    }
  }, [activeRoom]);

  const messageIsMine = useCallback(
    (msg: Message) => {
      return msg.sender?.username === authUser?.username;
    },
    [authUser],
  );

  if (messagesQuery.loading)
    return (
      <div className="flex-grow flex items-center justify-center">
        Loading...
      </div>
    );
  if (messagesQuery.error)
    return (
      <div className="flex-grow flex items-center justify-center">
        Error loading messages
      </div>
    );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto p-4">
        {messages
          .filter((msg) => msg.sender)
          .map((msg: Message) => (
            <div
              key={msg.id}
              className={`mb-3 flex ${messageIsMine(msg) ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-3 rounded-lg max-w-xs ${messageIsMine(msg) ? "bg-primary text-white" : "bg-placeholder"}`}
              >
                <span className="text-xs">{msg.sender.username}</span>
                <p>{msg.text}</p>
                <span className="text-xs">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500">
            Messages will appear here
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatBox;
