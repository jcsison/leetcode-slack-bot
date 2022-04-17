import { SlashCommand } from '@slack/bolt';

import { Log } from '../../../lib/utils/helpers';
import { fetchRandomQuestion } from '../../../lib/dataSource/leetcode/actions';
import { getPreviousQuestionMessage } from '../../actions';
import { UpdateData } from '../helper';

export const reroll = async (command: SlashCommand) => {
  try {
    const previousQuestionMessage = await getPreviousQuestionMessage(
      command.channel_id,
      command.api_app_id,
      command.user_id
    );

    if (!previousQuestionMessage || !previousQuestionMessage.ts) {
      throw new Error('Error fetch previous question message');
    }

    const randomQuestion = await fetchRandomQuestion();

    if (!randomQuestion) {
      throw new Error('Error fetching random question');
    }

    const updateData: UpdateData = {
      text: randomQuestion.url,
      ts: previousQuestionMessage.ts
    };

    return updateData;
  } catch (error) {
    Log.error(error);
  }
};
