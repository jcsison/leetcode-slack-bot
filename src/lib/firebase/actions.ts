import {
  equalTo,
  get,
  orderByChild,
  query,
  ref,
  remove,
  set
} from 'firebase/database';

import { ObjectGroup } from '../utils/types';
import { db } from '../..';

export const dbStore = async (key: string, value: unknown) => {
  await set(ref(db, key), value);
};

export const dbRead = async <T>(key: string) => {
  const dataSnapshot = await get(ref(db, key));
  const data: Partial<T> | undefined = dataSnapshot.val();
  return data;
};

// This uses an unsafe type assertion as a workaround for a typing issue with
// FileInstallationSource.fetchInstallation()
export const dbUnsafeRead = async <T>(key: string) => {
  const dataSnapshot = await get(ref(db, key));
  const data: T = dataSnapshot.val();
  return data;
};

export const dbDelete = async (key: string) => {
  await remove(ref(db, key));
};

export const dbFindByChildKeyValue = async <T>(
  key: string,
  childKey: string,
  value: string
) => {
  const dataSnapshot = await get(
    query(ref(db, key), orderByChild(childKey), equalTo(value))
  );
  const data: ObjectGroup<T> | undefined = dataSnapshot.val();
  return data ? Object.entries<T>(data)[0] : undefined;
};
