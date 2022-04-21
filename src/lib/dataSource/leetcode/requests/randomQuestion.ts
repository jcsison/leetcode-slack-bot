import { Variables } from 'graphql-request';

import { Enums, LeetCodeTypes } from '../../../utils/types';
import { Queries } from '../graphql/queries';
import { graphQLRequest } from '../graphql';

export const randomQuestion = (
  difficulty?: Enums.QuestionDifficulty,
  tags?: string[]
) => {
  const variables: Variables = {
    categorySlug: 'algorithms',
    filters: {
      difficulty: difficulty ?? Enums.QuestionDifficulty.EASY,
      tags
    }
  };

  return graphQLRequest<LeetCodeTypes.Question>(
    'randomQuestion',
    Queries.randomQuestion,
    variables
  );
};
