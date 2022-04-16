import { gql } from 'graphql-request';

export const randomQuestion = gql`
  query randomQuestion(
    $categorySlug: String
    $filters: QuestionListFilterInput
  ) {
    randomQuestion(categorySlug: $categorySlug, filters: $filters) {
      titleSlug
      isPaidOnly
    }
  }
`;
