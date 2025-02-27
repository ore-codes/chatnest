import { map } from "rxjs";

import { User } from "./auth.types";
import { IDBStorageService } from "@/lib/storage/IdbStorageService";

class AuthService {
  userStorage = new IDBStorageService<User>("user");
  tokenStorage = new IDBStorageService<string>("access_token");

  isAuthenticated$ = this.userStorage.data$.pipe(map((user) => Boolean(user)));

  async logout() {
    await this.userStorage.clear();
    await this.tokecoonsole.nStorage.clear();
  }
}

export const authService = new AuthService();
