import { BehaviorSubject } from "rxjs";

export abstract class AbstractStorageService<T> {
  protected subject: BehaviorSubject<T | null>;

  constructor(protected key: string) {
    this.subject = new BehaviorSubject<T | null>(null);
    this.initialize();
  }

  protected abstract initialize(): void;

  get data$() {
    return this.subject.asObservable();
  }

  abstract setData(value: T): void;
  abstract clear(): void;
}
