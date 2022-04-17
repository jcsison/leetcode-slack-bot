export class DataError extends Error {
  data: unknown = undefined;

  constructor(message: string, data: unknown) {
    super(message);
    this.data = data;
  }
}

export interface Default<T> {
  default: T;
}

export type Maybe<T> = T | undefined | null;
