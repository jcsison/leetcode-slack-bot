export const convertFromPathTs = (ts: string) => ts.replace('_', '.');

export const convertToPathTs = (ts: string) => ts.replace('.', '_');

export const createFilter = (...filters: string[]) => filters.join('_');

export const createPath = (...keys: string[]) =>
  keys.map(key => key.replace(/[\/]/g, '')).join('/');
