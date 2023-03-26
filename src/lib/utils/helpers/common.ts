import { GuardType } from '../types/index.js';
import { Log } from './index.js';

export const createRecord = <T>(key: string, value: T): Record<string, T> => ({
  [key]: value
});

export const parseJSON = <T>(text: string | undefined, guard: GuardType<T>) => {
  try {
    if (!text) {
      return undefined;
    }

    const result = JSON.parse(text);

    if (guard(result)) {
      return result;
    } else {
      throw new Error(`Error parsing JSON: ${text}`);
    }
  } catch (error) {
    Log.error(error);
  }

  return undefined;
};
