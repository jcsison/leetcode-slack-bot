import { SlashCommand } from '@slack/bolt';

import { TimeStampedMessageData } from '../helper.js';
import { getPreviousMessage, getToken } from '../../actions/index.js';

export const delete_ = async (command: SlashCommand) => {
  const token = await getToken(
    command.enterprise_id,
    !!command.is_enterprise_install,
    command.team_id
  );

  const previousMessage = await getPreviousMessage(
    command.api_app_id,
    command.channel_id,
    command.user_id,
    token
  );

  if (!previousMessage.ts) {
    throw new Error('Error fetching previous message');
  }

  const deleteData: TimeStampedMessageData = {
    ts: previousMessage.ts
  };

  return deleteData;
};
