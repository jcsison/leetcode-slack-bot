import {
  equalTo,
  get,
  orderByChild,
  query,
  ref,
  remove,
  set
} from 'firebase/database';

import { Log } from '../utils/helpers';
import { db } from '../..';

export const dbStore = async (key: string, value: unknown) => {
  try {
    await set(ref(db, key), value);
  } catch (error) {
    Log.error(error, 'Error storing data to db');
  }
};

export const dbRead = async <T>(key: string) => {
  try {
    const dataSnapshot = await get(ref(db, key));
    const data: T = dataSnapshot.val();
    return data;
  } catch (error) {
    Log.error(error, 'Error reading data to db');
  }
};

export const dbUnsafeRead = async <T>(key: string) => {
  try {
    const dataSnapshot = await get(ref(db, key));
    const data: T = dataSnapshot.val();
    return data;
  } catch (error) {
    Log.error(error, 'Error reading data to db');
    // This unsafe type assertion is a workaround for a typing issue with
    // FileInstallationSource.fetchInstallation()
    return {} as T;
  }
};

export const dbDelete = async (key: string) => {
  try {
    await remove(ref(db, key));
  } catch (error) {
    Log.error(error, 'Error deleting data from db');
  }
};

export const dbFindByChildKeyValue = async <T>(
  key: string,
  childKey: string,
  value: string
) => {
  try {
    const dataSnapshot = await get(
      query(ref(db, key), orderByChild(childKey), equalTo(value))
    );
    const data = Object.entries<T>(dataSnapshot.val())[0];
    return data;
  } catch (error) {
    Log.error(error, 'Error finding from db');
  }
};
