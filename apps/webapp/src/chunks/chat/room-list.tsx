"use client";

import { useMutation, useQuery } from "@apollo/client";
import { GetJoinedRooms, MarkMessagesAsRead } from "@/lib/chat/chat.gql";
import { Room } from "@/lib/chat/chat.types";
import { chatService } from "@/lib/chat/ChatService";
import useRxState from "@/lib/storage/useRxState";
import { Icon } from "@iconify/react";
import { useCallback, useRef } from "react";
import Modal, { ModalRef } from "@/components/modal";
import JoinRoomForm from "@/chunks/chat/join-room-form";
import { authService } from "@/lib/auth/AuthService";
import { useRouter } from "next/navigation";

const RoomList = () => {
  const router = useRouter();
  const { data, loading, error } = useQuery(GetJoinedRooms, {
    pollInterval: 20000,
  });
  const activeRoom = useRxState(chatService.activeRoom.data$);
  const [markMessagesAsRead] = useMutation(MarkMessagesAsRead);
  const joinRoomModalRef = useRef<ModalRef>(null);

  const openChat = useCallback(
    (room: Room["room"]) => {
      chatService.activeRoom.setData(room);
      markMessagesAsRead({
        variables: { roomId: room.id },
        refetchQueries: [GetJoinedRooms],
      });
    },
    [markMessagesAsRead],
  );

  const logout = useCallback(() => {
    authService.logout();
    router.push("/login");
  }, [router]);

  if (loading)
    return <div className="w-64 p-4 bg-gray-900 text-white">Loading...</div>;
  if (error)
    return (
      <div className="w-64 p-4 bg-gray-900 text-white">Error loading rooms</div>
    );

  return (
    <>
      <div className="w-64 bg-primary text-white p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Chats</h2>
          <div className="flex gap-4 items-center">
            <button
              className="hover:scale-105"
              onClick={() => joinRoomModalRef.current?.present()}
            >
              <Icon icon="mingcute:plus-fill" className="size-5" />
            </button>
            <button className="hover:scale-105" onClick={logout}>
              <Icon icon="streamline:logout-1-solid" className="size-5" />
            </button>
          </div>
        </div>
        <div className="flex flex-col space-y-3">
          {data.joinedRooms.map((chat: Room) => (
            <button
              key={chat.room.id}
              onClick={() => openChat(chat.room)}
              className={`p-3 rounded-lg text-left ${
                activeRoom?.id === chat.room.id
                  ? "bg-light/20"
                  : "bg-dark/20 hover:brightness-90"
              }`}
            >
              <div className="flex justify-between">
                <span className="font-medium">{chat.room.name}</span>
                {chat.unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
              <div className="text-sm text-placeholder truncate">
                {chat.lastMessage?.text || "No messages yet"}
              </div>
            </button>
          ))}
        </div>
      </div>
      <Modal ref={joinRoomModalRef}>
        <JoinRoomForm onClose={() => joinRoomModalRef.current?.dismiss()} />
      </Modal>
    </>
  );
};

export default RoomList;
