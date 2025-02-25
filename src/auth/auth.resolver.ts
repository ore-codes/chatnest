import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthResponse } from './dto/auth-response.dto';
import { UserDTO } from '../user/user.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';
import { CurrentUser } from './decorators/current-user-decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async register(@Args('registerInput') { username, password }: RegisterInput) {
    return this.authService.register(username, password);
  }

  @Mutation(() => AuthResponse)
  async login(@Args('loginInput') { username, password }: LoginInput) {
    return this.authService.login(username, password);
  }

  @Query(() => UserDTO)
  @UseGuards(GqlAuthGuard)
  me(@CurrentUser() user: UserDTO) {
    return user;
  }
}
