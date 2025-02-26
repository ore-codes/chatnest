import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from '../room/room.entity';
import { User } from '../../user/user.entity';

@ObjectType()
@Entity()
export class Message {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  text: string;

  @Field()
  @CreateDateColumn()
  timestamp: Date;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.messages, { eager: true })
  sender: User;

  @Field(() => Room)
  @ManyToOne(() => Room, (room) => room.messages, { eager: true })
  room: Room;
}
