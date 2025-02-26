import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { Message } from './message.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../user/user.entity';

@Resolver(() => Message)
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @Mutation(() => Message)
  @UseGuards(GqlAuthGuard)
  async sendMessage(
    @Args('room') roomName: string,
    @Args('text') text: string,
    @CurrentUser() user: User,
  ): Promise<Message> {
    return this.messageService.saveMessage(user, roomName, text);
  }

  @Query(() => [Message])
  async getRoomMessages(
    @Args('room') roomName: string,
    @Args('limit', { nullable: true }) limit?: number,
  ) {
    return this.messageService.getMessages(roomName, limit);
  }
}
