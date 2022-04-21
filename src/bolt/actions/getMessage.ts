import { Log } from '../../lib/utils/helpers';
import { bolt } from '../..';

export const getMessage = async (
  messageTs: string,
  channelId: string,
  token: string
) => {
  try {
    const conversations = await bolt.client.conversations.history({
      channel: channelId,
      token
    });

    const message = conversations.messages?.find(
      message => message.ts === messageTs
    );

    return message;
  } catch (error) {
    Log.error(error, 'Error fetching message');
  }
};
