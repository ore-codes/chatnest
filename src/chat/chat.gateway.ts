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
import { UserService } from '../user/user.service';
import { MessageService } from './message/message.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private roomService: RoomService,
    private messageService: MessageService,
    private usersService: UserService,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() payload: { username: string; room: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { username, room } = payload;

    const user = await this.usersService.findOne(username);
    if (!user) {
      client.emit('error', 'User not found');
      return;
    }

    const joinedRoom = await this.roomService.joinRoom(user, room);
    client.join(room);

    this.server
      .to(room)
      .emit('message', { text: `${username} joined the room.` });
    this.server.to(room).emit(
      'activeUsers',
      joinedRoom.participants.map((u) => u.username),
    );
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() payload: { sender: string; text: string; room: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { sender, text, room } = payload;
    const timestamp = new Date().toISOString();

    const user = await this.usersService.findOne(sender);
    if (!user) {
      client.emit('error', 'User not found');
      return;
    }

    await this.messageService.saveMessage(user, room, text);

    this.server.to(room).emit('message', { sender, text, timestamp });
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @MessageBody() payload: { username: string; room: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { username, room } = payload;

    client.leave(room);
    this.server
      .to(room)
      .emit('message', { text: `${username} left the room.` });

    const roomDetails = await this.roomService.findRoomByName(room);
    if (roomDetails) {
      this.server.to(room).emit(
        'activeUsers',
        roomDetails.participants.map((u) => u.username),
      );
    }
  }
}
