"use client";

import { useEffect, useState } from "react";
import { chatService } from "@/lib/chat/ChatService";
import { Subscription } from "rxjs";

export function useChatSocket() {
  const [socket, setSocket] = useState(chatService.socket$.value);
  const [socketSubscription, setSocketSubscription] = useState<Subscription>();

  useEffect(() => {
    const socketSub = chatService.socket$.subscribe((newSocket) => {
      setSocket(newSocket);
    });

    setSocketSubscription(socketSub);

    return () => {
      socketSubscription?.unsubscribe();
    };
  }, []);

  return { socket };
}
