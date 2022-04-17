import { RecurrenceRule, scheduleJob } from 'node-schedule';

import { Constants, Maybe, QuestionDifficulty } from '../../lib/utils/types';
import { Question } from '../../lib/utils/types';
import { bolt } from '../..';
import { getChannels } from '../actions/getChannels';
import { getRandomQuestion } from '../../lib/dataSource/leetcode/actions';
import { logError, logInfo } from '../../lib/utils/helpers';
import { uri } from '../../lib/dataSource/leetcode/graphql/config';

const rule = new RecurrenceRule();
rule.hour = 18;

const postQuestionFunc = async () => {
  try {
    const channels = await getChannels();

    let fetchAttempts = Constants.MAX_FETCH_ATTEMPTS;
    let randomQuestion: Maybe<Question> = undefined;

    // Keep fetching random questions until a non-premium is fetched
    while (
      (!randomQuestion || randomQuestion.isPaidOnly) &&
      fetchAttempts > 0
    ) {
      randomQuestion = await getRandomQuestion(QuestionDifficulty.EASY);
      fetchAttempts--;
    }

    if (!randomQuestion) {
      throw new Error('Error fetching question');
    }

    const questionUrl = uri.problem(randomQuestion.titleSlug);

    channels?.forEach(async channel => {
      if (channel.id) {
        await bolt.client.chat.postMessage({
          channel: channel.id,
          text: questionUrl
        });

        logInfo(
          { channelName: channel.name, message: questionUrl },
          'Posted question'
        );
      }
    });
  } catch (error) {
    logError(error, 'Error posting question');
  }
};

export const postQuestion = () => scheduleJob(rule, postQuestionFunc);
