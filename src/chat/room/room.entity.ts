import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/user.entity';
import { Message } from '../message/message.entity';

@ObjectType()
@Entity()
export class Room {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field(() => [User])
  @ManyToMany(() => User, (user) => user.rooms, { cascade: true })
  @JoinTable()
  participants: User[];

  @Field(() => [Message])
  @OneToMany(() => Message, (message) => message.room)
  messages: Message[];
}
