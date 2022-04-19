import { Installation } from '@slack/bolt';
import { RecurrenceSpecObjLit, scheduleJob } from 'node-schedule';

import { Log } from '../../lib/utils/helpers';
import { ObjectGroup } from '../../lib/utils/types';
import { bolt } from '../..';
import { dbRead } from '../../lib/firebase';
import { fetchRandomQuestion } from '../../lib/dataSource/leetcode/actions';
import { getChannels } from '../actions/getChannels';

class PostQuestion {
  rule: RecurrenceSpecObjLit = { hour: 18 };
  fn = async () => {
    try {
      const installationGroup = await dbRead<ObjectGroup<Installation>>(
        '/installation'
      );

      const installations = Object.entries(installationGroup);

      if (!installations.length) {
        throw new Error('Error fetching installations');
      }

      installations.forEach(async installation => {
        const token = installation[1].bot?.token;

        if (!token) {
          Log.error(`Error fetching token for ${installation[0]}`);
          return;
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
      });
    } catch (error) {
      Log.error(error, 'Error posting question');
    }
  };
  job = () => scheduleJob(this.rule, this.fn);
}

export const postQuestion = new PostQuestion().job;
