export class DataError extends Error {
  data: unknown = undefined;

  constructor(message: string, data: unknown) {
    super(message);
    this.data = data;
  }
}

export type GuardType<T> = (o: unknown) => o is T;

export type Maybe<T> = T | undefined | null;
