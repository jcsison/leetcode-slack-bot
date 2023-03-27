import { bolt } from '../../index.js';

export const getReplies = async (
  messageTs: string,
  channelId: string,
  token: string
) => {
  const messagesResult = await bolt.client.conversations.replies({
    channel: channelId,
    inclusive: true,
    token,
    ts: messageTs
  });

  return messagesResult.messages;
};
