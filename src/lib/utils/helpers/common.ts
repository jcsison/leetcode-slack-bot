import { ObjectGroup } from '../types';

export const createObjectGroup = <T>(
  key: string,
  value: T
): ObjectGroup<T> => ({
  [key]: value
});
