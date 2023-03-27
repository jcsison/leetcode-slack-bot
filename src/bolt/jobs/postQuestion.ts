import { RecurrenceSpecObjLit, scheduleJob } from 'node-schedule';

import { Log } from '../../lib/utils/helpers/index.js';
import { DBTypes, Enums } from '../../lib/utils/types/index.js';
import { bolt } from '../../index.js';
import {
  createPath,
  dbRead,
  DB_KEY,
  DB_TYPE_KEY
} from '../../lib/firebase/index.js';
import { getRandomQuestion } from '../../lib/dataSource/leetcode/actions/index.js';

class PostQuestion {
  rule: RecurrenceSpecObjLit = {
    // dayOfWeek: [new Range(2, 6)],
    dayOfWeek: [2, 4],
    hour: 1,
    minute: 0,
    second: 0
  }; // 01:00 UTC Tue-Sat / 18:00 PDT Mon-Fri
  fn = async () => {
    try {
      const postQuestionData = await dbRead<
        Record<string, DBTypes.PostQuestion>
      >(createPath(DB_KEY.POST_QUESTION, DB_TYPE_KEY.CHANNELS));

      if (!postQuestionData) {
        throw new Error('Error fetching channels');
      }

      const postQuestionChannels = Object.entries(postQuestionData);

      postQuestionChannels.forEach(async postQuestionChannel => {
        try {
          const postChannel = postQuestionChannel[1];
          const channelId = postQuestionChannel[0];
          const token = postChannel?.token;

          if (!token) {
            Log.error(`Error fetching token for ${postQuestionChannel[0]}`);
            return;
          }

          const randomQuestion = await getRandomQuestion(channelId, {
            difficulty: Enums.QUESTION_DIFFICULTY.EASY,
            listId: 'wpwgkgt'
          });

          if (!randomQuestion) {
            throw new Error('Error fetching question');
          }

          if (channelId) {
            await bolt.client.chat.postMessage({
              channel: channelId,
              text: randomQuestion.url,
              token
            });

            Log.info(
              { channelId, message: randomQuestion.url },
              'Posted question'
            );
          }
        } catch (error) {
          Log.error(error, 'Error posting question');
        }
      });
    } catch (error) {
      Log.error(error, 'Error posting question');
    }
  };
  job = () => scheduleJob(this.rule, this.fn);
}

export const postQuestion = new PostQuestion().job;
