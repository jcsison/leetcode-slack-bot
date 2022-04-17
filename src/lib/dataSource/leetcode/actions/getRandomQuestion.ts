import { Variables } from 'graphql-request';

import { Queries } from '../graphql/queries';
import { Question } from '../../../utils/types';
import { QuestionDifficulty } from '../../../utils/types/enums';
import { graphQLRequest } from '../graphql';

export const getRandomQuestion = (difficulty?: QuestionDifficulty) => {
  const variables: Variables = {
    categorySlug: 'algorithms',
    filters: {
      difficulty: difficulty ?? QuestionDifficulty.EASY
    }
  };

  return graphQLRequest<Question>(
    'randomQuestion',
    Queries.randomQuestion,
    variables
  );
};
