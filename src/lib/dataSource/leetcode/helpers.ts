import { uri } from './graphql/config.js';

export const validateLeetCodeUrl = (url: string | undefined) => {
  return url?.includes(uri.problem(''));
};
