import { onValue, ref, set } from 'firebase/database';

import { db } from '../..';
import { Log } from '../utils/helpers';

export const dbStore = async (key: string, value: unknown) => {
  try {
    await set(ref(db, key), value);
  } catch (error) {
    Log.error('Error storing data to db', key);
  }
};

export const dbRead = async (key: string) => {
  try {
    await new Promise(resolve =>
      onValue(ref(db, key), snapshot => resolve(snapshot.val()))
    );
  } catch (error) {
    Log.error('Error reading data from db', key);
  }
};
