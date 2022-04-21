export type Guard<T> = (o: unknown) => o is T;

export const array =
  <T>(guard?: Guard<T>): Guard<T[]> =>
  (o: unknown): o is T[] =>
    !!guard ? Array.isArray(o) && o.every(guard) : Array.isArray(o);

export const filter = <T>(o: unknown[], guard: Guard<T>) => o.filter(guard);

export const object =
  <T extends object>(...properties: Array<keyof T>): Guard<T> =>
  (o: unknown): o is T =>
    !!properties?.length
      ? typeof o === 'object' &&
        properties.every(property => property in (o as object))
      : typeof o === 'object';

export const string: Guard<string> = (o: unknown): o is string =>
  typeof o === 'string';

export const validate = <T>(o: unknown, guard: Guard<T>) =>
  guard(o) ? o : undefined;
