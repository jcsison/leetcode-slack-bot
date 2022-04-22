import { RecurrenceSpecObjLit, scheduleJob } from 'node-schedule';

import { Log } from '../../lib/utils/helpers';
import { DBTypes, ObjectGroup } from '../../lib/utils/types';
import { bolt } from '../..';
import { DBKey, dbRead } from '../../lib/firebase';
import { getChannels } from '../actions/getChannels';
import { getRandomQuestion } from '../../lib/dataSource/leetcode/actions';

class PostQuestion {
  rule: RecurrenceSpecObjLit = { hour: 1, minute: 0, second: 0 }; // 01:00 UTC / 18:00 PDT
  fn = async () => {
    try {
      const postChannelsData = await dbRead<ObjectGroup<DBTypes.PostChannel>>(
        DBKey.POST_CHANNEL
      );

      if (!postChannelsData) {
        throw new Error('Error fetching channels');
      }

      const postChannels = Object.entries(postChannelsData);

      postChannels.forEach(async postChannelEntry => {
        const postChannel = postChannelEntry[1];
        const token = postChannel.token;

        if (!token) {
          Log.error(`Error fetching token for ${postChannelEntry[0]}`);
          return;
        }

        const channels = await getChannels(token);
        const randomQuestion = await getRandomQuestion();

        if (!randomQuestion) {
          throw new Error('Error fetching question');
        }

        channels?.forEach(async channel => {
          if (channel.id) {
            await bolt.client.chat.postMessage({
              channel: channel.id,
              text: randomQuestion.url,
              token
            });

            Log.info(
              { channelName: channel.name, message: randomQuestion.url },
              'Posted question'
            );
          }
        });
      });
    } catch (error) {
      Log.error(error, 'Error posting question');
    }
  };
  job = () => scheduleJob(this.rule, this.fn);
}

export const postQuestion = new PostQuestion().job;
