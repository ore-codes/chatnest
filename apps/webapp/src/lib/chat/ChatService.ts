import { io, Socket } from "socket.io-client";
import { Env } from "@/lib/config";
import { authService } from "@/lib/auth/AuthService";
import { BehaviorSubject, combineLatest, lastValueFrom } from "rxjs";
import { SessionStorageService } from "@/lib/storage/SessionStorageService";
import { ChatEvents, Room } from "@/lib/chat/chat.types";

class ChatService {
  activeRoom = new SessionStorageService<Room["room"]>("active_room");
  private socket: Socket | null = null;
  public socket$ = new BehaviorSubject<Socket | null>(null);

  constructor() {
    combineLatest([
      authService.tokenStorage.data$,
      this.activeRoom.data$,
    ]).subscribe(([token, room]) => {
      if (token) {
        this.connect(token, room);
      } else {
        this.disconnect();
      }
    });
  }

  private connect(token: string, room: Room["room"] | null): void {
    if (this.socket && this.socket.connected) {
      if (room) {
        this.socket.emit(ChatEvents.LEAVE_ROOM, { room: room.id });
        this.socket.emit(ChatEvents.JOIN_ROOM, { room: room.id });
      }
      return;
    }

    this.socket = io(Env.ServerUrl, {
      auth: { token },
      transports: ["websocket"],
    });

    this.socket.on("connect", () => {
      this.socket$.next(this.socket);

      if (room) {
        this.socket?.emit(ChatEvents.JOIN_ROOM, { room: room.id });
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      this.socket$.next(null);
    });
  }

  async disconnect() {
    if (this.socket) {
      const room = await lastValueFrom(this.activeRoom.data$);
      if (room) {
        this.socket.emit(ChatEvents.LEAVE_ROOM, { room: room.id });
      }
      this.socket.disconnect();
      this.socket = null;
      this.socket$.next(null);
    }
  }
}

export const chatService = new ChatService();
