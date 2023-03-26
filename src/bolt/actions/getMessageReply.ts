import { bolt } from '../../index.js';

export const getMessageReply = async (
  messageTs: string,
  channelId: string,
  token: string
) => {
  const messagesResult = await bolt.client.conversations.replies({
    channel: channelId,
    inclusive: true,
    limit: 1,
    ts: messageTs,
    token
  });

  const message = messagesResult.messages?.[0];

  if (!message) {
    throw new Error('Message not found');
  }

  return message;
};
