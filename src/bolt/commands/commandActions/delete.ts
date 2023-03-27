import { CommandAction, TimeStampedMessageData } from '../helper.js';
import { getPreviousMessage } from '../../actions/index.js';

export const delete_: CommandAction<TimeStampedMessageData> = async ({ command }, token) => {
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
