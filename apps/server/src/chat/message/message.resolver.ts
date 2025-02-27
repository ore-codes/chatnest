import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { Message } from './message.entity';
import { UseGuards } from '@nestjs/common';
import { GqlJwtGuard } from '../../auth/guards/gql-jwt.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../user/user.entity';

@UseGuards(GqlJwtGuard)
@Resolver(() => Message)
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @Mutation(() => Message)
  async sendMessage(
    @Args('room') roomId: string,
    @Args('text') text: string,
    @CurrentUser() user: User,
  ): Promise<Message> {
    return this.messageService.saveMessage(user, roomId, text);
  }

  @Query(() => [Message])
  async roomMessages(
    @Args('room') roomId: string,
    @Args('limit', { nullable: true }) limit?: number,
  ) {
    return this.messageService.getMessages(roomId, limit);
  }

  @Mutation(() => Boolean)
  async markMessagesAsRead(
    @Args('roomId') roomId: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.messageService.markMessagesAsRead(user.id, roomId);
  }
}
