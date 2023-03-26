import { bolt } from '../../index.js';
import { postError } from './index.js';

export const getPreviousMessage = async (
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

  const previousMessage = messages?.[0];

  if (!previousMessage) {
    throw new Error('Previous message not found');
  }

  if (previousMessage.reply_count) {
    await postError(
      'Previous message already has replies',
      channelId,
      token,
      userId
    );
  }

  return previousMessage;
};
