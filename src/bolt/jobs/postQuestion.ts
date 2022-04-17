import { RecurrenceSpecObjLit, scheduleJob } from 'node-schedule';

import { Log } from '../../lib/utils/helpers';
import { bolt } from '../..';
import { getChannels } from '../actions/getChannels';
import { fetchRandomQuestion } from '../../lib/dataSource/leetcode/actions';

class PostQuestion {
  rule: RecurrenceSpecObjLit = { hour: 18 };
  fn = async () => {
    try {
      const token = process.env.SLACK_BOT_TOKEN;

      if (!token) {
        throw new Error('Error fetching token');
      }

      const channels = await getChannels(token);
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
  job = () => scheduleJob(this.rule, this.fn);
}

export const postQuestion = new PostQuestion().job;
