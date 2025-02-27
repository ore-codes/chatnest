import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from './room/room.service';
import { MessageService } from './message/message.service';
import { ChatEvents } from './chat-events.enum';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';
import { AuthenticatedSocket } from '../auth/authenticated-socket.interface';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseGuards(WsJwtGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly roomService: RoomService,
    private readonly messageService: MessageService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      console.log(`Client connected: ${client.id}`);
    } catch (error) {
      console.error('WebSocket Authentication Failed:', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage(ChatEvents.JOIN_ROOM)
  async handleJoinRoom(
    @MessageBody() payload: { room: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const { room } = payload;
    const user = client.user;

    const joinedRoom = await this.roomService.findOne(room);
    await client.join(room);

    this.server.to(room).emit(ChatEvents.MESSAGE, {
      text: `${user.username} joined the room.`,
    });
    this.server.to(room).emit(
      ChatEvents.ACTIVE_USERS,
      joinedRoom.participants.map((u) => u.username),
    );
  }

  @SubscribeMessage(ChatEvents.SEND_MESSAGE)
  async handleSendMessage(
    @MessageBody() payload: { text: string; room: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const { text, room } = payload;
    const timestamp = new Date().toISOString();
    const user = client.user;

    await this.messageService.saveMessage(user, room, text);

    this.server
      .to(room)
      .emit(ChatEvents.MESSAGE, { sender: user, text, timestamp });
  }

  @SubscribeMessage(ChatEvents.LEAVE_ROOM)
  async handleLeaveRoom(
    @MessageBody() payload: { room: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const { room } = payload;
    const user = client.user;

    await client.leave(room);
    this.server.to(room).emit(ChatEvents.MESSAGE, {
      text: `${user.username} left the room.`,
    });

    const roomDetails = await this.roomService.findRoomByName(room);
    if (roomDetails) {
      this.server.to(room).emit(
        ChatEvents.ACTIVE_USERS,
        roomDetails.participants.map((u) => u.username),
      );
    }
  }
}
