import { Field, ObjectType } from '@nestjs/graphql';
import { Room } from '../room.entity';
import { Message } from '../../message/message.entity';

@ObjectType()
export class JoinedRoomDTO {
  @Field(() => Room)
  room: Room;

  @Field({ nullable: true })
  unreadCount: number;

  @Field(() => Message, { nullable: true })
  lastMessage?: Message;
}
