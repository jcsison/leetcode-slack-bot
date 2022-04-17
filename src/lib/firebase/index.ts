import { onValue, ref, remove, set } from 'firebase/database';

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
    return await new Promise<T>(resolve =>
      onValue(ref(db, key), snapshot => resolve(snapshot.val()))
    );
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
