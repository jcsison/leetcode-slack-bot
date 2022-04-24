import { bolt } from '../..';

export const getMessage = async (
  messageTs: string,
  channelId: string,
  token: string
) => {
  const messagesResult = await bolt.client.conversations.history({
    channel: channelId,
    inclusive: true,
    latest: messageTs,
    limit: 1,
    token
  });

  const message = messagesResult.messages?.[0];

  if (!message) {
    throw new Error('Message not found');
  }

  return message;
};
