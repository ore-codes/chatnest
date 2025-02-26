import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { User } from '../../user/user.entity';
import { Room } from '../room/room.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async saveMessage(
    sender: User,
    roomName: string,
    text: string,
  ): Promise<Message> {
    const room = await this.roomRepository.findOne({
      where: { name: roomName },
    });
    if (!room) {
      throw new Error(`Room ${roomName} not found`);
    }

    const message = this.messageRepository.create({
      sender,
      room,
      text,
    });

    return this.messageRepository.save(message);
  }

  async getMessages(roomName: string, limit: number = 50): Promise<Message[]> {
    return this.messageRepository.find({
      where: { room: { name: roomName } },
      order: { timestamp: 'DESC' },
      take: limit,
    });
  }
}
