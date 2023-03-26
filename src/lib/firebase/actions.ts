import { db } from '../../index.js';

export const dbStore = async <T>(key: string, value: T) => {
  await db.ref(key).set(value);
};

export const dbRead = async <T>(key: string) => {
  const dataSnapshot = await db.ref(key).get();
  const data: Partial<T> | undefined = dataSnapshot.val();
  return data;
};

// This uses an unsafe type assertion as a workaround for a typing issue with
// FileInstallationSource.fetchInstallation()
export const dbUnsafeRead = async <T>(key: string) => {
  const dataSnapshot = await db.ref(key).get();
  const data: T = dataSnapshot.val();
  return data;
};

export const dbDelete = async (key: string) => {
  await db.ref(key).remove();
};

export const dbFindByChildKeyValue = async <T>(
  key: string,
  childKey: string,
  value: string
) => {
  const dataSnapshot = await db
    .ref(key)
    .orderByChild(childKey)
    .equalTo(value)
    .get();
  const data: Record<string, T> | undefined = dataSnapshot.val();
  return data ? Object.entries<T>(data)[0] : undefined;
};
