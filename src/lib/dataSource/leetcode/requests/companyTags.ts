import { LeetCodeTypes } from '../../../utils/types';
import { Queries } from '../graphql/queries';
import { graphQLRequest } from '../graphql';

export const companyTags = () => {
  return graphQLRequest<LeetCodeTypes.Tag[]>(
    'companyTags',
    Queries.companyTags
  );
};
