import { Log } from '../../../lib/utils/helpers';
import { getRandomQuestion } from '../../../lib/dataSource/leetcode/actions';

export const roll = async () => {
  try {
    const randomQuestion = await getRandomQuestion();

    if (!randomQuestion) {
      throw new Error('Error fetching random question');
    }

    return randomQuestion.url;
  } catch (error) {
    Log.error(error, 'Error rolling question');
  }
};
