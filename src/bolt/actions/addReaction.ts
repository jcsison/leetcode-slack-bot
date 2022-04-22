import { Log } from '../../lib/utils/helpers';
import { bolt } from '../..';

export const addReaction = async (
  reactionName: string,
  channelId: string,
  messageTs: string,
  token: string
) => {
  try {
    await bolt.client.reactions.add({
      channel: channelId,
      name: reactionName,
      token,
      timestamp: messageTs
    });
  } catch (error) {
    Log.error(error, 'Error adding reaction');
  }
};
