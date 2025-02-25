import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(username: string, password: string) {
    const user = await this.userService.createUser(username, password);
    return this.authenticatedResponse(user);
  }

  async login(username: string, password: string) {
    const user = await this.userService.validateUser(username, password);
    return this.authenticatedResponse(user);
  }

  private authenticatedResponse({ id, username }: User) {
    const token = this.jwtService.sign({ sub: id, username });
    return {
      user: { id, username },
      access_token: token,
    };
  }
}
