import { AbstractStorageService } from "./AbstractStorageService";

export class SessionStorageService<T> extends AbstractStorageService<T> {
  protected initialize() {
    if (typeof window === "undefined") return;
    const storedValue = sessionStorage.getItem(this.key);
    if (storedValue) {
      try {
        this.subject.next(JSON.parse(storedValue));
      } catch (error) {
        console.error("Error parsing session storage value:", error);
        this.subject.next(null);
      }
    } else {
      this.subject.next(null);
    }
  }

  setData(value: T) {
    try {
      sessionStorage.setItem(this.key, JSON.stringify(value));
      this.subject.next(value);
    } catch (error) {
      console.error("Error setting session storage value:", error);
    }
  }

  clear() {
    sessionStorage.removeItem(this.key);
    this.subject.next(null);
  }
}
