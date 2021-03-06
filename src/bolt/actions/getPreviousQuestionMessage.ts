import { bolt } from '../..';
import { postError } from '.';
import { validateLeetCodeUrl } from '../../lib/dataSource/leetcode';

export const getPreviousQuestionMessage = async (
  appId: string,
  channelId: string,
  userId: string,
  token: string
) => {
  const conversations = await bolt.client.conversations.history({
    channel: channelId,
    token
  });

  const messages = conversations.messages?.filter(
    message => message.bot_profile?.app_id === appId
  );

  const previousMessage = messages?.find(message =>
    validateLeetCodeUrl(message.text)
  );

  if (!previousMessage) {
    throw new Error('Previous message not found');
  }

  if (previousMessage.reply_count) {
    await postError(
      'Previous question message already has replies',
      channelId,
      token,
      userId
    );
  }

  return previousMessage;
};
