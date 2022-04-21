import { SlashCommand } from '@slack/bolt';

import { Log } from '../../../lib/utils/helpers';
import { TimeStampedMessageData } from '../helper';
import { getPreviousQuestionMessage, getToken } from '../../actions';
import { roll } from './roll';

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
      command.api_app_id,
      command.channel_id,
      command.user_id,
      token
    );

    if (!previousQuestionMessage || !previousQuestionMessage.ts) {
      throw new Error('Error fetching previous question message');
    }

    const rolledQuestionUrl = await roll(command);

    if (!rolledQuestionUrl) {
      throw new Error('Error rolling question');
    }

    const updateData: TimeStampedMessageData = {
      text: rolledQuestionUrl,
      ts: previousQuestionMessage.ts
    };

    return updateData;
  } catch (error) {
    Log.error(error, 'Error rerolling question');
  }
};
