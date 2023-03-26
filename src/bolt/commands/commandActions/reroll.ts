import { SlashCommand } from '@slack/bolt';

import { TimeStampedMessageData } from '../helper.js';
import { getPreviousQuestionMessage, getToken } from '../../actions/index.js';
import { roll } from './roll.js';

export const reroll = async (command: SlashCommand) => {
  const token = await getToken(
    command.enterprise_id,
    !!command.is_enterprise_install,
    command.team_id
  );

  const previousQuestionMessage = await getPreviousQuestionMessage(
    command.api_app_id,
    command.channel_id,
    command.user_id,
    token
  );

  if (!previousQuestionMessage.ts) {
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
};
