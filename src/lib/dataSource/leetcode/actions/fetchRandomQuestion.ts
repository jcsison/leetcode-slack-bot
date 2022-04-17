import { Constants, Enums, LeetCodeTypes, Maybe } from '../../../utils/types';
import { Log } from '../../../utils/helpers';
import { getRandomQuestion } from '../requests';
import { uri } from '../graphql/config';

export const fetchRandomQuestion = async () => {
  try {
    let fetchAttempts = Constants.MAX_FETCH_ATTEMPTS;
    let randomQuestion: Maybe<LeetCodeTypes.Question> = undefined;

    // Keep fetching random questions until a non-premium is fetched
    while (
      (!randomQuestion || randomQuestion.isPaidOnly) &&
      fetchAttempts > 0
    ) {
      randomQuestion = await getRandomQuestion(Enums.QuestionDifficulty.EASY);
      fetchAttempts--;
    }

    if (!randomQuestion) {
      throw new Error('Error fetching question');
    }

    const questionUrl = uri.problem(randomQuestion.titleSlug);

    return { ...randomQuestion, url: questionUrl };
  } catch (error) {
    Log.error(error, 'Error fetching question');
  }
};
