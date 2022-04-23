import { Log } from '../../lib/utils/helpers';
import { bolt } from '../..';

export const getMessageReply = async (
  messageTs: string,
  channelId: string,
  token: string
) => {
  try {
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
  } catch (error) {
    Log.error(error, 'Error fetching message');
  }
};
