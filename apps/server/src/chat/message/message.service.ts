import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { User } from '../../user/user.entity';
import { Room } from '../room/room.entity';
import { MessageRead } from './message-read.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(MessageRead)
    private messageReadRepository: Repository<MessageRead>,
  ) {}

  async saveMessage(
    sender: User,
    roomId: string,
    text: string,
  ): Promise<Message> {
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
    });
    if (!room) {
      throw new Error(`Room ID ${roomId} not found`);
    }

    const message = this.messageRepository.create({
      sender,
      room,
      text,
    });

    return this.messageRepository.save(message);
  }

  async getMessages(roomId: string, limit: number = 50): Promise<Message[]> {
    return this.messageRepository.find({
      where: { room: { id: roomId } },
      take: limit,
    });
  }

  async markMessagesAsRead(userId: number, roomId: string): Promise<boolean> {
    const unreadMessages = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoin(
        'message.readReceipts',
        'readReceipts',
        'readReceipts.userId = :userId',
        { userId },
      )
      .where('message.roomId = :roomId', { roomId })
      .andWhere('readReceipts.id IS NULL')
      .getMany();

    const readReceipts = unreadMessages.map((message) =>
      this.messageReadRepository.create({ user: { id: userId }, message }),
    );

    await this.messageReadRepository.save(readReceipts);
    return true;
  }
}
