import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { RoomService } from './room/room.service';
import { RoomResolver } from './room/room.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './room/room.entity';
import { UserModule } from '../user/user.module';
import { Message } from './message/message.entity';
import { MessageService } from './message/message.service';
import { MessageResolver } from './message/message.resolver';
import { JwtService } from '@nestjs/jwt';
import { MessageRead } from './message/message-read.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Message, MessageRead]), UserModule],
  providers: [
    ChatGateway,
    MessageService,
    MessageResolver,
    RoomService,
    RoomResolver,
    JwtService,
  ],
  exports: [MessageService, RoomService],
})
export class ChatModule {}
