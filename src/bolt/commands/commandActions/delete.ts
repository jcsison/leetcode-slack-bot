import { SlashCommand } from '@slack/bolt';

import { Log } from '../../../lib/utils/helpers';
import { TimeStampedMessageData } from '../helper';
import { getPreviousQuestionMessage, getToken } from '../../actions';

export const delete_ = async (command: SlashCommand) => {
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
      command.api_app_id,
      command.channel_id,
      command.user_id,
      token
    );

    if (!previousQuestionMessage || !previousQuestionMessage.ts) {
      throw new Error('Error fetching previous question message');
    }

    const deleteData: TimeStampedMessageData = {
      ts: previousQuestionMessage.ts
    };

    return deleteData;
  } catch (error) {
    Log.error(error, 'Error deleting question');
  }
};
