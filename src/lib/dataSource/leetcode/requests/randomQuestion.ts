import { Variables } from 'graphql-request';

import { LeetCodeTypes } from '../../../utils/types';
import { Queries } from '../graphql/queries';
import { graphQLRequest } from '../graphql';

export const randomQuestion = (filters?: LeetCodeTypes.QuestionFilter) => {
  const variables: Variables = {
    categorySlug: 'algorithms',
    filters
  };

  return graphQLRequest<LeetCodeTypes.Question>(
    'randomQuestion',
    Queries.randomQuestion,
    variables
  );
};
