import { bolt } from '../../index.js';
import { postError } from './index.js';
import { validateLeetCodeUrl } from '../../lib/dataSource/leetcode/index.js';

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
