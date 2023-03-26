import { GuardType } from '../types/common.js'

type FunctionType = () => unknown | ((...args: unknown[]) => unknown)

const array =
  <T>(guard?: GuardType<T>): GuardType<T[]> =>
  (o: unknown): o is T[] =>
    !!guard ? Array.isArray(o) && o.every(guard) : Array.isArray(o);

const boolean: GuardType<boolean> = (o: unknown): o is boolean => typeof o === 'boolean';

const filter = <T>(o: unknown[], guard: GuardType<T>) => o.filter(guard);

const fx: GuardType<FunctionType> = (o: unknown): o is FunctionType =>
  typeof o === 'function';

const number: GuardType<number> = (o: unknown): o is number =>
  typeof o === 'number';

const object =
  <T extends object>(...properties: Array<keyof T>): GuardType<T> =>
  (o: unknown): o is T =>
    !!o &&
    typeof o === 'object' &&
    !Array.isArray(o) &&
    (!!properties?.length ? properties.every(property => property in o) : true);

const promise =
  <T>(): GuardType<Promise<T>> =>
  (o: unknown): o is Promise<T> =>
    object('catch', 'finally', 'then')(o) &&
    fx(o.catch) &&
    fx(o.finally) &&
    fx(o.then);

const string: GuardType<string> = (o: unknown): o is string =>
  typeof o === 'string';

const validate = <T>(o: unknown, guard: GuardType<T>) =>
  guard(o) ? o : undefined;

export const Guard = {
  array,
  boolean,
  filter,
  fx,
  number,
  object,
  promise,
  string,
  validate
};
