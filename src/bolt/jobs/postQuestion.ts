import { RecurrenceRule, scheduleJob } from 'node-schedule';

import { Constants, Enums, LeetCodeTypes, Maybe } from '../../lib/utils/types';
import { Log } from '../../lib/utils/helpers';
import { bolt } from '../..';
import { getChannels } from '../actions/getChannels';
import { getRandomQuestion } from '../../lib/dataSource/leetcode/actions';
import { uri } from '../../lib/dataSource/leetcode/graphql/config';

const rule = new RecurrenceRule();
rule.hour = 18;

const postQuestionFunc = async () => {
  try {
    const channels = await getChannels();

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

    channels?.forEach(async channel => {
      if (channel.id) {
        await bolt.client.chat.postMessage({
          channel: channel.id,
          text: questionUrl
        });

        Log.info(
          { channelName: channel.name, message: questionUrl },
          'Posted question'
        );
      }
    });
  } catch (error) {
    Log.error(error, 'Error posting question');
  }
};

export const postQuestion = () => scheduleJob(rule, postQuestionFunc);
