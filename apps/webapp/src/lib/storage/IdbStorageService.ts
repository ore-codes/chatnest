import { del, get, set } from "idb-keyval";
import { AbstractStorageService } from "./AbstractStorageService";

export class IDBStorageService<T> extends AbstractStorageService<T> {
  protected async initialize() {
    const storedValue = await get<T>(this.key);
    this.subject.next(storedValue || null);
  }

  async setData(value: T) {
    await set(this.key, value);
    this.subject.next(value);
  }

  async clear() {
    await del(this.key);
    this.subject.next(null);
  }
}
