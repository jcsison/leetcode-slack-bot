import { Log } from '../../lib/utils/helpers';
import { bolt } from '../..';

export const getMessage = async (
  messageTs: string,
  channelId: string,
  token: string
) => {
  try {
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
  } catch (error) {
    Log.error(error, 'Error fetching message');
  }
};
