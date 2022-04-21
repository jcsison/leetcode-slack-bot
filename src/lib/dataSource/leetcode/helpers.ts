import { uri } from './graphql/config';

export const validateLeetCodeUrl = (url: string | undefined) => {
  return url?.includes(uri.problem(''));
};
