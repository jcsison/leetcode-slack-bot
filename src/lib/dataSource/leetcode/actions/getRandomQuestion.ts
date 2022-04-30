import { Constants, LeetCodeTypes, Maybe } from '../../../utils/types';
import { Requests } from '../requests';
import { getSolvedQuestionSlugs } from '../../../../bolt/actions';
import { uri } from '../graphql/config';

export const getRandomQuestion = async (
  channelId: string,
  filters?: LeetCodeTypes.QuestionFilter
): Promise<LeetCodeTypes.Question> => {
  let fetchAttempts = Constants.MAX_FETCH_ATTEMPTS;
  let randomQuestion: Maybe<LeetCodeTypes.Question> = undefined;

  const solvedQuestionSlugs = await getSolvedQuestionSlugs(channelId);

  while (fetchAttempts > 0) {
    randomQuestion = await Requests.randomQuestion(filters);

    // Keep fetching random questions until a non-premium and non-duplicate is
    // fetched
    if (
      randomQuestion &&
      !randomQuestion.isPaidOnly &&
      !solvedQuestionSlugs.includes(randomQuestion.titleSlug)
    ) {
      break;
    }

    fetchAttempts--;
  }

  if (!randomQuestion) {
    throw new Error('Error fetching question');
  }

  if (fetchAttempts === 0) {
    throw new Error('Error fetching question, ran out of attempts');
  }

  const questionUrl = uri.problem(randomQuestion.titleSlug);

  return { ...randomQuestion, url: questionUrl };
};
