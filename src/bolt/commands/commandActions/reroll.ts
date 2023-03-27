import { CommandAction, TimeStampedMessageData } from '../helper.js';
import { getPreviousQuestionMessage } from '../../actions/index.js';
import { roll } from './roll.js';

export const reroll: CommandAction<TimeStampedMessageData> = async (
  res,
  token
) => {
  const { command } = res;

  const previousQuestionMessage = await getPreviousQuestionMessage(
    command.api_app_id,
    command.channel_id,
    command.user_id,
    token
  );

  if (!previousQuestionMessage.ts) {
    throw new Error('Error fetching previous question message');
  }

  const rolledQuestionUrl = await roll(res, token);

  if (!rolledQuestionUrl) {
    throw new Error('Error rolling question');
  }

  const updateData: TimeStampedMessageData = {
    text: rolledQuestionUrl,
    ts: previousQuestionMessage.ts
  };

  return updateData;
};
