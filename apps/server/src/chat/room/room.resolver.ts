import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RoomService } from './room.service';
import { Room } from './room.entity';
import { UseGuards } from '@nestjs/common';
import { GqlJwtGuard } from '../../auth/guards/gql-jwt.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../user/user.entity';
import { JoinedRoomDTO } from './dto/joined-room.dto';

@UseGuards(GqlJwtGuard)
@Resolver(() => Room)
export class RoomResolver {
  constructor(private readonly roomService: RoomService) {}

  @Mutation(() => Room)
  async createRoom(@Args('name') name: string): Promise<Room> {
    return this.roomService.createRoom(name);
  }

  @Mutation(() => Room)
  async joinRoom(
    @Args('name') name: string,
    @CurrentUser() user: User,
  ): Promise<Room> {
    return this.roomService.joinRoom(user, name);
  }

  @Query(() => Room, { nullable: true })
  async room(@Args('name') name: string): Promise<Room> {
    return this.roomService.findRoomByName(name);
  }

  @Query(() => [JoinedRoomDTO])
  async joinedRooms(@CurrentUser() user: User): Promise<JoinedRoomDTO[]> {
    return this.roomService.getJoinedRooms(user);
  }
}
