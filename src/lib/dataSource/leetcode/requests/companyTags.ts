import { LeetCodeTypes } from '../../../utils/types/index.js';
import { Queries } from '../graphql/queries/index.js';
import { graphQLRequest } from '../graphql/index.js';

export const companyTags = () => {
  return graphQLRequest<LeetCodeTypes.Tag[]>(
    'companyTags',
    Queries.companyTags
  );
};
