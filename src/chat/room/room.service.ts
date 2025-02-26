import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { User } from '../../user/user.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async createRoom(name: string): Promise<Room> {
    const existingRoom = await this.roomRepository.findOne({ where: { name } });
    if (existingRoom) return existingRoom;

    const room = this.roomRepository.create({ name });
    return this.roomRepository.save(room);
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

    if (!room.participants.find((participant) => participant.id === user.id)) {
      room.participants.push(user);
      await this.roomRepository.save(room);
    }

    return room;
  }
}
