import { map } from "rxjs";

import { User } from "./auth.types";
import { IDBStorageService } from "@/lib/storage/IdbStorageService";

class AuthService {
  user = new IDBStorageService<User>("user");
  token = new IDBStorageService<string>("access_token");

  isAuthenticated$ = this.user.data$.pipe(map((user) => Boolean(user)));

  async logout() {
    await this.user.clear();
    await this.token.clear();
  }
}

export const authService = new AuthService();
