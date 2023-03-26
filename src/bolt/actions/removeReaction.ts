import { Log } from '../../lib/utils/helpers/index.js';
import { bolt } from '../../index.js';

export const removeReaction = async (
  reactionName: string,
  channelId: string,
  messageTs: string,
  token: string
) => {
  try {
    await bolt.client.reactions.remove({
      channel: channelId,
      name: reactionName,
      timestamp: messageTs,
      token
    });
  } catch (error) {
    Log.error(error, 'Error adding reaction');
  }
};
