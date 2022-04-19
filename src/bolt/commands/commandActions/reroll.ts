import { SlashCommand } from '@slack/bolt';

import { Log } from '../../../lib/utils/helpers';
import { UpdateData } from '../helper';
import { fetchRandomQuestion } from '../../../lib/dataSource/leetcode/actions';
import { getPreviousQuestionMessage, getToken } from '../../actions';

export const reroll = async (command: SlashCommand) => {
  try {
    const token = await getToken(
      command.enterprise_id,
      !!command.is_enterprise_install,
      command.team_id
    );

    if (!token) {
      throw new Error('Error fetching token');
    }

    const previousQuestionMessage = await getPreviousQuestionMessage(
      command.channel_id,
      command.api_app_id,
      command.user_id,
      token
    );

    if (!previousQuestionMessage || !previousQuestionMessage.ts) {
      throw new Error('Error fetching previous question message');
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
    Log.error(error, 'Error rerolling question');
  }
};
