import { RecurrenceRule, scheduleJob } from 'node-schedule';

import { Log } from '../../lib/utils/helpers';
import { bolt } from '../..';
import { getChannels } from '../actions/getChannels';
import { fetchRandomQuestion } from '../../lib/dataSource/leetcode/actions';

const rule = new RecurrenceRule();
rule.hour = 18;

const postQuestionFunc = async () => {
  try {
    const channels = await getChannels();
    const randomQuestion = await fetchRandomQuestion();

    if (!randomQuestion) {
      throw new Error('Error fetching question');
    }

    channels?.forEach(async channel => {
      if (channel.id) {
        await bolt.client.chat.postMessage({
          channel: channel.id,
          text: randomQuestion.url
        });

        Log.info(
          { channelName: channel.name, message: randomQuestion.url },
          'Posted question'
        );
      }
    });
  } catch (error) {
    Log.error(error, 'Error posting question');
  }
};

export const postQuestion = () => scheduleJob(rule, postQuestionFunc);
