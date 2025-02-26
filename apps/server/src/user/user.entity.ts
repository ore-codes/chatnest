import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Room } from '../chat/room/room.entity';
import { Message } from '../chat/message/message.entity';

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => ID)
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Field(() => [Room])
  @ManyToMany(() => Room, (room) => room.participants)
  rooms: Room[];

  @Field(() => [Message])
  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];
}
