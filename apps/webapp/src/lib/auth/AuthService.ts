import { map } from "rxjs";

import { User } from "./auth.types";
import { IDBStorageService } from "@/lib/storage/IdbStorageService";
import { apolloClient } from "@/providers/apollo-provider";

class AuthService {
  user = new IDBStorageService<User>("user");
  token = new IDBStorageService<string>("access_token");

  isAuthenticated$ = this.user.data$.pipe(map((user) => Boolean(user)));

  async logout() {
    const { chatService } = await import("@/lib/chat/ChatService");
    chatService.activeRoom.clear();
    await Promise.all([
      this.user.clear(),
      this.token.clear(),
      apolloClient.clearStore(),
    ]);
  }
}

export const authService = new AuthService();
