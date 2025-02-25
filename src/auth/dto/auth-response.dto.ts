import { Field, ObjectType } from '@nestjs/graphql';
import { UserDTO } from '../../user/user.dto';

@ObjectType()
export class AuthResponse {
  @Field()
  user: UserDTO;

  @Field()
  access_token: string;
}
