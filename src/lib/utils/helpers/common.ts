export const createRecord = <T>(key: string, value: T): Record<string, T> => ({
  [key]: value
});
