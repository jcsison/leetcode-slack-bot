import { Variables } from 'graphql-request';

import { LeetCodeTypes } from '../../../utils/types/index.js';
import { Queries } from '../graphql/queries/index.js';
import { graphQLRequest } from '../graphql/index.js';

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
