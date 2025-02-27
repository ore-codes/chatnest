import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { User } from '../../user/user.entity';
import { JoinedRoomDTO } from './dto/joined-room.dto';
import { Message } from '../message/message.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,

    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async createRoom(name: string): Promise<Room> {
    const existingRoom = await this.roomRepository.findOne({ where: { name } });
    if (existingRoom) return existingRoom;

    const room = this.roomRepository.create({ name });
    return this.roomRepository.save(room);
  }

  async findOne(roomId: string): Promise<Room> {
    return this.roomRepository.findOne({
      where: { id: roomId },
      relations: ['participants'],
    });
  }

  async findRoomByName(name: string): Promise<Room> {
    return this.roomRepository.findOne({
      where: { name },
      relations: ['participants'],
    });
  }

  async joinRoom(user: User, roomName: string): Promise<Room> {
    let room = await this.findRoomByName(roomName);
    if (!room) {
      room = await this.createRoom(roomName);
    }

    if (!room.participants) {
      room.participants = [];
    }

    if (!room.participants.find((participant) => participant.id === user.id)) {
      room.participants.push(user);
      await this.roomRepository.save(room);
    }

    return room;
  }

  async getJoinedRooms(user: User): Promise<JoinedRoomDTO[]> {
    const rooms = await this.roomRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.messages', 'messages')
      .leftJoinAndSelect('room.participants', 'users')
      .where('users.id = :userId', { userId: user.id })
      .getMany();

    return await Promise.all(
      rooms.map(async (room) => {
        const unreadCount = await this.messageRepository
          .createQueryBuilder('message')
          .leftJoin(
            'message.readReceipts',
            'messageRead',
            'messageRead.userId = :userId',
            { userId: user.id },
          )
          .where('message.roomId = :roomId', { roomId: room.id })
          .andWhere('messageRead.id IS NULL')
          .andWhere('message.senderId != :userId', { userId: user.id })
          .getCount();

        const lastMessage = await this.messageRepository.findOne({
          where: { room: { id: room.id } },
          order: { timestamp: 'DESC' },
          relations: ['sender'],
        });

        return {
          room,
          unreadCount,
          lastMessage,
        };
      }),
    );
  }
}
