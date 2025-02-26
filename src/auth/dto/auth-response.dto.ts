import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/user.entity';

@ObjectType()
export class AuthResponse {
  @Field()
  user: User;

  @Field()
  token: string;
}
