import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RoomService } from './room.service';
import { Room } from './room.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../user/user.entity';

@Resolver(() => Room)
export class RoomResolver {
  constructor(private readonly roomService: RoomService) {}

  @Mutation(() => Room)
  @UseGuards(GqlAuthGuard)
  async createRoom(@Args('name') name: string): Promise<Room> {
    return this.roomService.createRoom(name);
  }

  @Mutation(() => Room)
  @UseGuards(GqlAuthGuard)
  async joinRoom(
    @Args('name') name: string,
    @CurrentUser() user: User,
  ): Promise<Room> {
    return this.roomService.joinRoom(user, name);
  }

  @Query(() => Room, { nullable: true })
  async getRoom(@Args('name') name: string): Promise<Room> {
    return this.roomService.findRoomByName(name);
  }
}
